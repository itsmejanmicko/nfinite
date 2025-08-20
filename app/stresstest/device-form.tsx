"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { Device } from "@/app/stresstest/page"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"

interface DeviceFormProps {
  device?: Device | null
  onSave: (device: Device | Omit<Device, "id">) => void
  onCancel: () => void
}

export function DeviceForm({ device, onSave, onCancel }: DeviceFormProps) {
  const [formData, setFormData] = useState({
    imei: "",
    sn: "",
    osVersion: "",
    beforeBattery: 0,
    afterBattery: 0,
    timeIn: "",
    timeOut: "",
    status: "Active" as Device["status"],
    remarks: "",
    assigned:"",
    notes: "",
    model:""
  })

 useEffect(() => {
  const amPmTo24h = (time: string) => {
    if (!time) return "";
    const [hourMin, period] = time.split(" ");
    let [hour, minute] = hourMin.split(":").map(Number);
    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;
    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
  };

  if (device) {
    setFormData({
      imei: device.imei,
      sn: device.sn,
      osVersion: device.osVersion,
      beforeBattery: device.beforeBattery,
      afterBattery: device.afterBattery,
      timeIn: amPmTo24h(device.timeIn),   // Convert for time input
      timeOut: amPmTo24h(device.timeOut), // Convert for time input
      status: device.status,
      remarks: device.remarks,
      notes: device.notes,
      assigned: device.assigned ? device.assigned : "",
      model:device.model? device.model : ""
    });
  }
}, [device]);


  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  const formatToAmPm = (time: string) => {
    const [hour, minute] = time.split(":").map(Number);
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12; 
    return `${hour12}:${minute.toString().padStart(2, "0")} ${period}`;
  };

  const formattedData = {
    ...formData,
    timeIn: formatToAmPm(formData.timeIn),
    timeOut: formData.timeOut ? formatToAmPm(formData.timeOut) : "",
  };

  if (device) {
   
    onSave({ ...device, ...formattedData });
  } else {
    onSave(formattedData);
  }
};
 

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold">{device ? "Edit Device" : "Add New Device"}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="imei">IMEI</Label>
                <Input
                  id="imei"
                  value={formData.imei}
                  onChange={(e) => handleChange("imei", e.target.value)}
                  placeholder="Enter IMEI"
                  required
                />
              </div>
              <div>
                <Label htmlFor="sn">Serial Number</Label>
                <Input
                  id="sn"
                  value={formData.sn}
                  onChange={(e) => handleChange("sn", e.target.value)}
                  placeholder="Enter SN"
                  required
                />
              </div>
            </div>
      <div>
                <Label htmlFor="sn">Model</Label>
                <Input
                  id="sn"
                  value={formData.model}
                  onChange={(e) => handleChange("model", e.target.value)}
                  placeholder="Enter Model"
                  required
                />
              </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="osVersion">OS Version</Label>
                <Input
                  id="osVersion"
                  value={formData.osVersion}
                  onChange={(e) => handleChange("osVersion", e.target.value)}
                  placeholder="eg. 3.4.43"
                  required
                />
              </div>
              <div>
                <Label htmlFor="assigned">Assigned</Label>
                <Input
                  id="assigned"
                  value={formData.assigned}
                  onChange={(e) => handleChange("assigned", e.target.value)}
                  placeholder="Enter assigned user"
                />
              </div>
              <div>
                  <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status}
                  onValueChange={(value) => handleChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Failed">Defective</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>

              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="beforeBattery">Before Battery (%)</Label>
                <Input
                  id="beforeBattery"
                  type="number"
                  min=""
                  max="100"
                  value={formData.beforeBattery}
                  onChange={(e) => handleChange("beforeBattery",(e.target.value))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="afterBattery">After Battery (%)</Label>
                <Input
                  id="afterBattery"
                  type="number"
                  min=""
                  max="100"
                  value={formData.afterBattery}
                  onChange={(e) => handleChange("afterBattery",(e.target.value))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>
    <Label htmlFor="timeIn">Time In</Label>
    <Input
      id="timeIn"
      type="time" // changed from datetime-local
      value={formData.timeIn}
      onChange={(e) => handleChange("timeIn", e.target.value)}
      required
    />
  </div>
  <div>
    <Label htmlFor="timeOut">Time Out</Label>
    <Input
      id="timeOut"
      type="time" // changed from datetime-local
      value={formData.timeOut}
      onChange={(e) => handleChange("timeOut", e.target.value)}
    />
  </div>
</div>


            <div>
              <Label htmlFor="remarks">Remarks</Label>
              <Input
                id="remarks"
                value={formData.remarks}
                onChange={(e) => handleChange("remarks", e.target.value)}
                placeholder="Enter remarks"
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                placeholder="Enter detailed notes"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white">
                {device ? "Update Device" : "Add Device"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
