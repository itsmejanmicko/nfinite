import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

const devices = [
  {
    name: "Develop API Endpoints",
    date: "Due date: July 20, 2024",
    icon: "🔧",
    color: "bg-blue-100",
  },
  {
    name: "Onboarding Flow",
    date: "Due date: July 25, 2024",
    icon: "📱",
    color: "bg-green-100",
  },
  {
    name: "Build Dashboard",
    date: "Due date: July 30, 2024",
    icon: "📊",
    color: "bg-purple-100",
  },
  {
    name: "Optimize Page Load",
    date: "Due date: Aug 5, 2024",
    icon: "⚡",
    color: "bg-yellow-100",
  },
  {
    name: "Cross-Browser Testing",
    date: "Due date: Aug 10, 2024",
    icon: "🌐",
    color: "bg-red-100",
  },
]

export function DeviceList() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Device</h3>
        <Button variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-1" />
          New
        </Button>
      </div>

      <div className="space-y-3">
        {devices.map((device, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className={`w-8 h-8 ${device.color} rounded-lg flex items-center justify-center text-sm`}>
              {device.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{device.name}</p>
              <p className="text-xs text-gray-500">{device.date}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
