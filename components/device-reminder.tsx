import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"
import { useRouter } from "next/navigation";

export function DeviceReminders() {
  const router = useRouter();
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Reminders</h3>

      <div className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Stress Test with QA Team</h4>
          <div className="flex items-center text-sm text-gray-600 mb-3">
            <Clock className="w-4 h-4 mr-1" />
            Time: 8:00 pm - 04:00 pm
          </div>
          <Button 

           onClick={() => router.push('/stresstest')}
          size="sm" className="bg-green-600 hover:bg-green-700">
            Start Testing
          </Button>
        </div>
      </div>
    </Card>
  )
}
