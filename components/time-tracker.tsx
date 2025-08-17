import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pause, Square } from "lucide-react"

export function TimeTracker() {
  return (
    <Card className="p-6 bg-green-900 text-white">
      <h3 className="text-lg font-semibold mb-6">Time Tracker</h3>

      <div className="text-center mb-6">
        <div className="text-3xl font-mono font-bold mb-2">01:24:08</div>
      </div>

      <div className="flex space-x-2">
        <Button variant="secondary" size="sm" className="flex-1">
          <Pause className="w-4 h-4" />
        </Button>
        <Button variant="destructive" size="sm" className="flex-1">
          <Square className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  )
}
