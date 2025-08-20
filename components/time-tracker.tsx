'use client'
import { Card } from "@/components/ui/card"

import { useEffect, useState } from "react"

export function TimeTracker() {
  const [time, setTime] = useState<Date | undefined>()
  useEffect(()=>{
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  },[])

  return (
    <Card className="p-6 bg-green-900 text-white">
      <h3 className="text-lg font-semibold mb-6">Time Tracker</h3>

      <div className="text-center mb-6">
        <div className="text-3xl font-mono font-bold mb-2">{time?.toLocaleTimeString()}</div>
      </div>
    </Card>
  )
}
