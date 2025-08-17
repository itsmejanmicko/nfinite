import { Search, Mail, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/input"
import { useAuth } from "@/context/authcontext"
import { useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Device {
  id: string;
  imei: string;
  sn: string;
  osVersion: string;
  beforeBattery: number;
  afterBattery: number;
  timeIn: string;
  timeOut: string;
  status: "Active" | "Testing" | "Failed" | "Completed";
  remarks: string;
  notes: string;
  assigned?: string;
  model?: string;
}

const COLUMNS: { key: keyof Device | "duration"; label: string }[] = [
  { key: "imei", label: "IMEI" },
  { key: "sn", label: "SN" },
  { key: "model", label: "Model" },
  { key: "osVersion", label: "OS Version" },
  { key: "beforeBattery", label: "Before Battery" },
  { key: "afterBattery", label: "After Battery" },
  { key: "timeIn", label: "Time In" },
  { key: "timeOut", label: "Time Out" },
  { key: "duration", label: "Duration" },
  { key: "status", label: "Status" },
  { key: "remarks", label: "Remarks" },
  { key: "notes", label: "Notes" },
  { key: "assigned", label: "Assigned" },
];
function parseTime(timeStr: string): Date | null {
  if (!timeStr) return null;

  const today = new Date();
  const [time, modifier] = timeStr.split(" "); 

  if (!time || !modifier) return null;

  let [hours, minutes] = time.split(":").map(Number);

  if (modifier === "PM" && hours < 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  const date = new Date(today);
  date.setHours(hours, minutes || 0, 0, 0);

  return date;
}

function getDuration(timeIn: string, timeOut?: string) {
  const start = parseTime(timeIn);
  const end = timeOut ? parseTime(timeOut) : new Date();

  if (!start || !end) return { label: "—", hours: 0 };

  const diffMs = end.getTime() - start.getTime();
  if (diffMs <= 0) return { label: "—", hours: 0 };

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  return { label: `${hours}h ${minutes}m`, hours };
}


export function DashboardHeader() {
    const {user} = useAuth();



  const [loading, setLoading] = useState(false);

  async function downloadExcel() {
    setLoading(true);
    try {
      // 1. Fetch Firestore data
      const snap = await getDocs(collection(db, "stresstest"));
      const devices: Device[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Device, "id">),
      }));

      // 2. Map to Excel rows
      const formatted = devices.map((d) => {
        const row: Record<string, string | number> = {};
        COLUMNS.forEach(({ key, label }) => {
          if (key === "duration") {
            row[label] = getDuration(d.timeIn, d.timeOut).label;
          } else {
            row[label] = (d[key as keyof Device] ?? "") as any;
          }
        });
        return row;
      });

      // 3. Generate Excel
      const XLSX = await import("xlsx");
      const ws = XLSX.utils.json_to_sheet(formatted, { header: COLUMNS.map((c) => c.label) });
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Devices");

      // Auto column width
      const colWidths = COLUMNS.map((c) => ({
        wch: Math.max(c.label.length, ...formatted.map((r) => (r[c.label] ? String(r[c.label]).length : 0))) + 2,
      }));
      ws["!cols"] = colWidths;

      XLSX.writeFile(wb, `devices-${Date.now()}.xlsx`);
    } catch (err) {
      console.error("Excel export failed", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
          
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button 
          onClick={downloadExcel}
          disabled={loading}
           size="sm">
             {loading ? "Generating PDF..." : "Export Data"}
           </Button>

          <div className="flex items-center space-x-3 ml-6">
            <Button variant="ghost" size="sm">
              <Mail className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Bell className="w-4 h-4" />
            </Button>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">{user?.email?.slice(0,1).toUpperCase()}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                <p className="text-xs text-gray-500"></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
