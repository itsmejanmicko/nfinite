"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation" 
import { useAuth } from "./authcontext"

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/") 
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950 text-white">
        Loading...
      </div>
    )
  }
  return <>{children}</>
}

export default ProtectedRoute
