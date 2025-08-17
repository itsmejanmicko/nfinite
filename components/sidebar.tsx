"use client"

import { useGlobalFetch } from "@/context/globalfetch"
import { cn } from "@/lib/utils"
import logo from '@/lib/logo.png'
import {
  BookmarkCheck,
  HelpCircle,
  Home,
  LogOut,
  Settings,
  Smartphone,
  ToggleRight,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { LogoutConfirmationDialog } from "./logout"
import { toast } from "sonner"
import { signOut } from "firebase/auth"
import { auth, db } from "@/lib/firebase"
import { useAuth } from "@/context/authcontext"
import { collection, getDocs, query, updateDoc, where } from "firebase/firestore"

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuth()

  const { devices, loading } = useGlobalFetch()
  const [activeCount, setActiveCount] = useState(0)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [collapsed, setCollapsed] = useState(false) // 👈 sidebar collapsed state

  useEffect(() => {
    if (loading) return
    if (devices) {
      const activeDevices = devices.filter((device) => device.status === "Active")
      setActiveCount(activeDevices.length)
    }
  }, [devices, loading])

  async function handleConfirm() {
    setShowLogoutDialog(true)
  }

  const handleLogout = async () => {
    toast.promise(
      (async () => {
        const q = query(collection(db, "users"), where("uid", "==", user?.uid))
        const querySnapshot = await getDocs(q)

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0].ref
          await updateDoc(userDoc, {
            status: "Offline",
            lastLogin: new Date(),
          })
          await signOut(auth)
          router.push("/")
        }
      })(),
      {
        loading: "Logging out...",
        success: () => "Logged out successfully ✅",
        error: (err) => err.message || "Logout failed ❌",
      }
    )
  }

  const navigation = [
    { name: "Dashboard", icon: Home, link: "/dashboard" },
    { name: "Devices", icon: Smartphone, link: "/device" },
    { name: "Active", icon: ToggleRight, badge: activeCount, link: "/stresstest" },
    { name: "Task", icon: BookmarkCheck },
    { name: "Team", icon: Users },
  ]

  const general = [
    { name: "Settings", icon: Settings },
    { name: "Help", icon: HelpCircle },
    { name: "Logout", icon: LogOut, action: handleConfirm },
  ]

  return (
    <div
      className={cn(
        "h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header with toggle button */}
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <Smartphone className="w-5 h-5 text-white" />
          </div>
          {!collapsed && <span className="text-xl font-semibold text-gray-900">DeviceTest</span>}
        </div>
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="p-1 rounded-lg hover:bg-gray-100 transition"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      <nav className="flex-1 px-2">
        {/* MENU */}
        {!collapsed && (
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider px-2 py-2">MENU</div>
        )}
        {navigation.map((item) => {
          const isActive = item.link && pathname === item.link

          return item.link ? (
            <Link
              key={item.name}
              href={item.link}
              className={cn(
                "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                isActive ? "bg-green-50 text-green-700" : "text-gray-700 hover:bg-gray-50"
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {!collapsed && (
                <>
                  {item.name}
                  {item.badge && item.badge > 0 && (
                    <span className="ml-auto bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          ) : (
            <div
              key={item.name}
              className="group flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-400 cursor-not-allowed"
            >
              <item.icon className="mr-3 h-5 w-5" />
              {!collapsed && item.name}
            </div>
          )
        })}

        {/* GENERAL */}
        <div className="mt-8 space-y-1">
          {!collapsed && (
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider px-3 py-2">GENERAL</div>
          )}
          {general.map((item) => (
            <button
              key={item.name}
              onClick={item.action}
              className="w-full text-left group flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <item.icon className="mr-3 h-5 w-5" />
              {!collapsed && item.name}
            </button>
          ))}
        </div>
      </nav>

      <LogoutConfirmationDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog} onConfirm={handleLogout} />
    </div>
  )
}
