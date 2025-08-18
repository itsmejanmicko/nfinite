"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DeviceTable } from "./device-table";
import { DeviceForm } from "./device-form";
import ProtectedRoute from "@/context/protectedRoute";
import { DashboardHeader } from "@/components/dashboard-header";
import { Sidebar } from "@/components/sidebar";
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";

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
  assigned: string;
  model:string;
}



export default function DeviceManagement() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);

  const handleAddDevice = async (device: Omit<Device, "id">) => {
 
    try {
      const docRef = await addDoc(collection(db, "stresstest"), device);
      toast.success("Successfully added device");
      setDevices((prev) => [...prev, { ...device, id: docRef.id }]);
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error adding device:", error);
      toast.error("Error adding device");
    }
  };

  const handleEditDevice = async (device: Device) => {

    try {
      const deviceRef = doc(db, "stresstest", device.id);
      const { id, ...deviceData } = device;
      await updateDoc(deviceRef, deviceData);
      setDevices((prev) => prev.map((d) => (d.id === device.id ? device : d)));
      toast.success("Device updated successfully");
      setEditingDevice(null);
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error updating device:", error);
      toast.error("Failed to update device");
    }
  };

  const handleDeleteDevice = async (id: string) => {
  try {
    const confirmDelete = window.confirm("Are you sure you want to delete this device?")
    if (!confirmDelete) return

     toast.promise(
      (async () => {
        const docRef = doc(db, "stresstest", id)
        await deleteDoc(docRef)
        setDevices((prev) => prev.filter((d) => d.id !== id))
      })(),
      {
        loading: "Deleting device...",
        success: "Device deleted successfully ✅",
        error: "Failed to delete device ❌",
      }
    )
  } catch (error) {
    console.error("Error deleting device:", error)
    toast.error("Something went wrong")
  }
}


  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await getDocs(collection(db, "stresstest"));
      const items: Device[] = [];
      userData.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() } as Device);
      });
      setDevices(items);
    };
    fetchUserData();
  }, []);

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto">
              <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">Device Management</h1>
                      <p className="text-gray-600 mt-1">
                        Monitor, analyze, and manage your device stress tests with ease.
                      </p>
                    </div>
                    <Button
                      onClick={() => {
                        setEditingDevice(null); // ✅ reset editing state when adding
                        setIsFormOpen(true);
                      }}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Device
                    </Button>
                  </div>

                  {/* Device Table */}
                  <DeviceTable
                    devices={devices}
                    onEdit={(device) => {
                      setEditingDevice(device);
                      setIsFormOpen(true); // ✅ Open modal when editing
                    }}
                    onDelete={handleDeleteDevice}
                  />

                  {/* Device Form Modal */}
                  {isFormOpen && (
                    <DeviceForm
                      device={editingDevice}
                      onSave={(device) => {
                        if (editingDevice) {
                          handleEditDevice(device as Device);
                        } else {
                          handleAddDevice(device as Omit<Device, "id">);
                        }
                      }}
                      onCancel={() => {
                        setIsFormOpen(false);
                        setEditingDevice(null);
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
