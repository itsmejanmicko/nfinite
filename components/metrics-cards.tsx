import { Card } from "@/components/ui/card"
import { db } from "@/lib/firebase"
import { collection, getDocs } from "firebase/firestore"
import { TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"

interface Device {
  id: string
  imei: string
  assigned:string
  sn: string
  osVersion: string
  beforeBattery: number
  afterBattery: number
  timeIn: string
  timeOut: string
  status: "Active" | "Testing" | "Failed" | "Completed"
  remarks: string
  notes: string
}

export function MetricsCards() {
  const [stats, setStats] = useState({
    totalDevices: 0,
    activeTests: 0,
    runningTests: 0,
    failedDevices: 0,
    assignedDevice:0
  })

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "stresstest"))
      const devices = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Device[]

      const totalDevices = devices.length
      const activeTests = devices.filter(d => d.status === "Active").length
      const runningTests = devices.filter(d => d.status === "Testing").length
      const failedDevices = devices.filter(d => d.status === "Failed").length
      const assignedDevice = devices.filter(d => d.assigned !=="").length

      setStats({  
        totalDevices,
        activeTests,
        runningTests,
        failedDevices,
        assignedDevice
      })
    }

    fetchData()
  }, [])

  const metrics = [
    {
      title: "Total Devices",
      value: stats.totalDevices,
      color: "bg-green-600",
      icon: "📱",
    },
    {
      title: "Active Tests",
      value: stats.activeTests,
      color: "bg-blue-600",
      icon: "⚡",
    },
    {
      title: "Assigned Device",
      value: stats.assignedDevice,
      color: "bg-purple-600",
      icon: "🔥",
    },
    {
      title: "Failed Devices",
      value: stats.failedDevices,
      color: "bg-red-600",
      icon: "❌",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <Card key={index} className={`${metric.color} text-white p-6 relative overflow-hidden`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium opacity-90">{metric.title}</h3>
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-black" />
            </div>
          </div>
          <div className="mb-2">
            <span className="text-3xl font-bold">{metric.value}</span>
          </div>
          <div className="absolute -right-4 -bottom-4 text-6xl opacity-20">{metric.icon}</div>
        </Card>
      ))}
    </div>
  )
}
