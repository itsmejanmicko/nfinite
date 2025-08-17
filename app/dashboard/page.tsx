'use client'
import { DashboardHeader } from "@/components/dashboard-header";
import { DeviceAnalytics } from "@/components/device-analytics";
import { DeviceList } from "@/components/device-list";
import { DeviceReminders } from "@/components/device-reminder";
import { MetricsCards } from "@/components/metrics-cards";
import { Sidebar } from "@/components/sidebar";
import { StressTestProgress } from "@/components/stress-test-progress";
import { TeamCollaboration } from "@/components/team-collaboration";
import { TimeTracker } from "@/components/time-tracker";
import ProtectedRoute from "@/context/protectedRoute";


export default function Dashboard() {
  return (
  <ProtectedRoute>
       <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">Dashboard</h1>
              <p className="text-gray-600">Monitor the, analyze, and manage your device stress tests with ease.</p>
            </div>

            <MetricsCards />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              <div className="lg:col-span-2 space-y-6">
                <DeviceAnalytics />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DeviceReminders />
                  <TeamCollaboration />
                </div>
              </div>

              <div className="space-y-6">
                <StressTestProgress />
                <TimeTracker />
                <DeviceList />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </ProtectedRoute>
  )
}
