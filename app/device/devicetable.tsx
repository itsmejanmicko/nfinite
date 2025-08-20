"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter } from "lucide-react"
import { useGlobalFetch } from "@/context/globalfetch"



export default function ListDevice() {
  const [searchTerm, setSearchTerm] = useState("")
  const [modelFilter, setModelFilter] = useState("all")
  const [assignmentFilter, setAssignmentFilter] = useState("all")
  const {devices} = useGlobalFetch();

  const filteredDevices = useMemo(() => {
    return devices.filter((device) => {
      const matchesSearch =
        device.sn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.imei.includes(searchTerm) ||
        device.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (device.assigned && device.assigned.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesModel = modelFilter === "all" || device.model === modelFilter
      const matchesAssignment =
        assignmentFilter === "all" ||
        (assignmentFilter === "assigned" && device.assigned) ||
        (assignmentFilter === "unassigned" && !device.assigned)

      return matchesSearch && matchesModel && matchesAssignment
    })
  }, [searchTerm, modelFilter, assignmentFilter])

  const stats = useMemo(() => {
    const total = devices.length
    const assigned = devices.filter((d) => d.assigned).length
    const p2Count = devices.filter((d) => d.model === "P2").length
    const v2Count = devices.filter((d) => d.model === "V2 PRO").length

    return { total, assigned, unassigned: total - assigned, p2Count, v2Count }
  }, [])

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Device Management</h1>
            <p className="text-muted-foreground mt-1">Manage and track all devices in your inventory</p>
          </div>
        </div>


        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
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
              <Select value={modelFilter} onValueChange={setModelFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Models</SelectItem>
                  <SelectItem value="P2">P2 Devices</SelectItem>
                  <SelectItem value="V2 PRO">V2 Devices</SelectItem>
                </SelectContent>
              </Select>
              <Select value={assignmentFilter} onValueChange={setAssignmentFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by assignment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Devices</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Device Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Device List ({filteredDevices.length} of {devices.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-semibold">Serial Number</th>
                    <th className="text-left p-4 font-semibold">IMEI</th>
                    <th className="text-left p-4 font-semibold">Model</th>
                    <th className="text-left p-4 font-semibold">Status</th>
                    <th className="text-left p-4 font-semibold">Assigned To</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDevices.map((device) => (
                    <tr key={device.id} className="border-b hover:bg-muted/50">
                      <td className="p-4 font-mono text-sm">{device.sn}</td>
                      <td className="p-4 font-mono text-sm">{device.imei}</td>
                      <td className="p-4">
                        <Badge
                          variant={device.model === "P2" ? "default" : "secondary"}
                          className={
                            device.model === "P2" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                          }
                        >
                          {device.model}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={device.assigned ? "default" : "secondary"}
                          className={device.assigned ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}
                        >
                          {device.assigned ? "Assigned" : "Available"}
                        </Badge>
                      </td>
                      <td className="p-4">
                        {device.assigned ? (
                          <span className="text-foreground">{device.assigned}</span>
                        ) : (
                          <span className="text-muted-foreground italic">Not assigned</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredDevices.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">No devices found matching your filters.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
