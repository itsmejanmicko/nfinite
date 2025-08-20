"use client";

import type { Device } from "@/app/stresstest/page";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Input } from "@/components/input";


interface DeviceTableProps {
  devices: Device[];
  onEdit: (device: Device) => void;
  onDelete: (id: string) => void;
}

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


function getCondition(device: Device) {
  if (!device.timeOut) return null

  const duration = getDuration(device.timeIn, device.timeOut)
  const batteryDiff = device.beforeBattery - device.afterBattery
  const remainingBattery = device.afterBattery 

  if (duration.hours >= 6 && remainingBattery > 30) {
    const deviceRef = doc(db, "stresstest", device.id)
    updateDoc(deviceRef, { result: "Pass" })

    return <div className="text-green-500">Pass</div>
  }
  const deviceRef = doc(db, "stresstest", device.id)
  updateDoc(deviceRef, { result: "Fail" })

  return <div className="text-red-500">Fail</div>
}



export function DeviceTable({ devices, onEdit, onDelete }: DeviceTableProps) {
  const [now, setNow] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");


  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: Device["status"]) => {
    switch (status) {
      case "Active":
        return "bg-blue-100 text-blue-800";
      case "Testing":
        return "bg-purple-100 text-purple-800";
      case "Failed":
        return "bg-red-100 text-red-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const filteredDevices = devices.filter((device) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      device.sn.toLowerCase().includes(searchLower) ||
      device.imei.toLowerCase().includes(searchLower) ||
      (device.model && device.model.toLowerCase().includes(searchLower)) ||
      (device.assigned && device.assigned.toLowerCase().includes(searchLower))
    );
  });

  return (
    <Card className="overflow-hidden">
     <CardContent className="mx-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by SN, IMEI, model, or assigned user..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IMEI</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SN</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OS Version</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Before Battery</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">After Battery</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time In</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Out</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
           {filteredDevices && filteredDevices.length > 0 ? (
  filteredDevices.map((device) => {
    const duration = getDuration(device.timeIn, device.timeOut);
    return (
      <tr key={device.id} className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{device.imei}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{device.sn}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{device.model}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{device.osVersion}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{device.beforeBattery}%</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{device.afterBattery}%</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{device.timeIn}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {device.timeOut || "In Progress"}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{duration.label}</td>
        <td className="px-6 py-4 whitespace-nowrap">
          <Badge className={getStatusColor(device.status)}>{device.status}</Badge>
        </td>
        <td className="px-6 py-4 text-sm text-gray-900">
          {getCondition(device)}
        </td>
        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{device.remarks}</td>
        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{device.notes}</td>
        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{device.assigned}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(device)}
              className="text-blue-600 hover:text-blue-800"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(device.id)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </td>
      </tr>
    );
  })
) : (
  <tr>
    <td colSpan={13} className="px-6 py-4 text-center text-sm text-gray-500">
      No devices found.
    </td>
  </tr>
)}

          </tbody>
        </table>
      </div>
    </Card>
  );
}
