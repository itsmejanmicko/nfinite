"use client";
import React, { useEffect, useMemo, useState } from "react";
import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const COLUMNS = [
  "IMEI",
  "SN",
  "Model",
  "OS Version",
  "Before Battery",
  "After Battery",
  "Time In",
  "Time Out",
  "Duration",
  "Status",
  "Condition",
  "Remarks",
  "Notes",
  "Assigned",
] as const;

export type Row = Record<(typeof COLUMNS)[number], string> & { id?: string };

const emptyRow: Row = {
  IMEI: "",
  SN: "",
  Model: "",
  "OS Version": "",
  "Before Battery": "",
  "After Battery": "",
  "Time In": "",
  "Time Out": "",
  Duration: "",
  Status: "",
  Condition: "",
  Remarks: "",
  Notes: "",
  Assigned: "",
};

function diffHHmm(startIso: string, endIso: string): string {
  if (!startIso || !endIso) return "";
  try {
    const start = new Date(startIso);
    const end = new Date(endIso);
    if (isNaN(+start) || isNaN(+end)) return "";
    let ms = end.getTime() - start.getTime();
    if (ms < 0) return "";
    const totalMinutes = Math.floor(ms / 60000);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${pad(h)}:${pad(m)}`;
  } catch {
    return "";
  }
}

export default function Page() {
  const [rows, setRows] = useState<Row[]>([]);
  const [draft, setDraft] = useState<Row>({ ...emptyRow });
  const [editingId, setEditingId] = useState<string | null>(null);

  // 🔹 Real-time Firestore subscription
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "devices"), (snap) => {
      setRows(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Row) })));
    });
    return () => unsub();
  }, []);

  const draftDuration = useMemo(
    () => draft.Duration || diffHHmm(draft["Time In"], draft["Time Out"]),
    [draft.Duration, draft["Time In"], draft["Time Out"]]
  );

  function updateDraft<K extends keyof Row>(key: K, value: string) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  async function addRow() {
    const row = { ...draft, Duration: draftDuration };
    await addDoc(collection(db, "devices"), row);
    setDraft({ ...emptyRow });
  }

  function startEdit(r: Row) {
    setEditingId(r.id!);
    setDraft({ ...r });
  }

  async function saveEdit() {
    if (!editingId) return;
    await updateDoc(doc(db, "devices", editingId), {
      ...draft,
      Duration: draftDuration,
    });
    setEditingId(null);
    setDraft({ ...emptyRow });
  }

  async function deleteRow(id: string) {
    await deleteDoc(doc(db, "devices", id));
  }

  async function exportPDF() {
    const { jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;

    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
    doc.setFontSize(14).text("IMEI Data Export", 40, 36);
    doc.setFontSize(10).text(new Date().toLocaleString(), 40, 52);

    const body = rows.map((r) => COLUMNS.map((c) => r[c] ?? ""));
    autoTable(doc, {
      head: [COLUMNS as unknown as string[]],
      body,
      startY: 70,
      styles: { fontSize: 9, cellPadding: 6, overflow: "linebreak" },
      headStyles: { fillColor: [230, 230, 230] },
      didDrawPage: () => {
        const pageSize = doc.internal.pageSize;
        doc.setFontSize(9);
        doc.text(`Page ${doc.getNumberOfPages()}`, pageSize.width - 60, pageSize.height - 16);
      },
    });

    doc.save(`imei-data-${Date.now()}.pdf`);
  }

  const isEditing = editingId !== null;

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">IMEI Data</h1>
        <button
          onClick={exportPDF}
          className="rounded-2xl px-4 py-2 bg-black text-white shadow hover:opacity-90"
        >
          Export PDF
        </button>
      </header>

      {/* Form */}
      <section className="mb-8 rounded-2xl bg-white p-4 shadow">
        <h2 className="mb-3 text-lg font-medium">{isEditing ? "Edit Entry" : "Add Entry"}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {COLUMNS.map((c) =>
            c === "Remarks" || c === "Notes" ? (
              <TextArea key={c} label={c} value={draft[c]} onChange={(v) => updateDraft(c, v)} />
            ) : c === "Time In" || c === "Time Out" ? (
              <DateTimeInput key={c} label={c} value={draft[c]} onChange={(v) => updateDraft(c, v)} />
            ) : (
              <TextInput key={c} label={c} value={c === "Duration" ? draftDuration : draft[c]} onChange={(v) => updateDraft(c, v)} />
            )
          )}
        </div>
        <div className="mt-4 flex gap-2">
          {isEditing ? (
            <>
              <button onClick={saveEdit} className="rounded-2xl px-4 py-2 bg-emerald-600 text-white shadow hover:opacity-90">Save</button>
              <button onClick={() => { setEditingId(null); setDraft({ ...emptyRow }); }} className="rounded-2xl px-4 py-2 bg-white shadow hover:bg-gray-100">Cancel</button>
            </>
          ) : (
            <button onClick={addRow} className="rounded-2xl px-4 py-2 bg-blue-600 text-white shadow hover:opacity-90">Add Entry</button>
          )}
        </div>
      </section>

      {/* Table */}
      <section className="rounded-2xl bg-white p-4 shadow">
        <h2 className="mb-3 text-lg font-medium">Records ({rows.length})</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr>
                {COLUMNS.map((c) => (
                  <th key={c} className="sticky top-0 bg-gray-100 p-2 text-left font-semibold border-b">{c}</th>
                ))}
                <th className="sticky top-0 bg-gray-100 p-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  {COLUMNS.map((c) => (
                    <td key={c} className="border-b p-2 align-top whitespace-pre-wrap">{r[c]}</td>
                  ))}
                  <td className="border-b p-2">
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(r)} className="rounded-xl px-3 py-1 bg-white shadow hover:bg-gray-100">Edit</button>
                      <button onClick={() => deleteRow(r.id!)} className="rounded-xl px-3 py-1 bg-red-600 text-white shadow hover:opacity-90">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={COLUMNS.length+1} className="p-3 text-center">No records yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

function FieldWrapper({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-gray-600">{label}</span>
      {children}
    </label>
  );
}

function TextInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <FieldWrapper label={label}>
      <input className="w-full rounded-xl border border-gray-300 p-2" value={value} onChange={(e) => onChange(e.target.value)} />
    </FieldWrapper>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <FieldWrapper label={label}>
      <textarea className="w-full rounded-xl border border-gray-300 p-2 min-h-[42px]" value={value} onChange={(e) => onChange(e.target.value)} />
    </FieldWrapper>
  );
}

function DateTimeInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <FieldWrapper label={label}>
      <input type="datetime-local" className="w-full rounded-xl border border-gray-300 p-2" value={value} onChange={(e) => onChange(e.target.value)} />
    </FieldWrapper>
  );
}
