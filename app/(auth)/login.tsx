"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/input"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Lock, User } from "lucide-react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "@/lib/firebase"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  setDoc,
  doc,
} from "firebase/firestore"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    toast.promise(
      (async () => {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        )

        const uid = userCredential.user.uid
        const q = query(collection(db, "users"), where("uid", "==", uid))
        const querySnapshot = await getDocs(q)

        if (!querySnapshot.empty) {
          const userDocRef = querySnapshot.docs[0].ref
          await updateDoc(userDocRef, {
            status: "Online",
            lastLogin: new Date(),
          })
        } else {
          const newUserRef = doc(collection(db, "users"))
          await setDoc(newUserRef, {
            uid,
            name: userCredential.user.displayName || "",
            email: userCredential.user.email,
            status: "Online",
            lastLogin: new Date(),
          })
        }
        router.push("/dashboard")
        return userCredential
      })(),
      {
        loading: "Logging in...",
        success: () => "Login successful 🎉",
        error: (err) => {
          console.error("Login failed:", err)
          return err.message || "Login failed ❌"
        },
      }
    )
  }

  const handleGuestLogin = () => {
    toast.info("Under development for Gues Login")
  }

  return (
    <Card className="w-full max-w-md bg-gray-900/80 border-gray-700 backdrop-blur-sm">
      <CardContent className="p-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-white/80"></div>
          </div>
        </div>

        {/* Welcome text */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Please login to your account</p>
        </div>

        {/* Login form */}
        <form onSubmit={handleLogin} className="space-y-4 mb-6">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-12 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-12 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
          >
            Login
          </Button>
        </form>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-900 text-gray-400">OR</span>
          </div>
        </div>

        {/* Guest login button */}
        <div className="flex justify-center items-center">
          <Button
            variant="outline"
            onClick={handleGuestLogin}
            className="bg-gray-800/50 border-gray-600 hover:bg-gray-700 text-white p-3 w-full"
          >
            <User className="w-5 h-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
