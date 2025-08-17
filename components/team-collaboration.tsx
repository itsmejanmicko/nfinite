'use client'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { SignUpModal } from "@/app/(auth)/signup"

const statusColors = {
  Online: "bg-green-100 text-green-800",
  "In Progress": "bg-yellow-100 text-yellow-800",
  Pending: "bg-gray-100 text-gray-800",
  Offline: "bg-gray-100 text-gray-800",
}

// List of colors to rotate avatars
const avatarColors = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-indigo-500",
]

export function TeamCollaboration() {
  const [members, setMembers] = useState<
    Array<{ name: string; email: string; status?: string }>
  >([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const data = await getDocs(collection(db, "users"))
      const membersData = data.docs.map(doc => {
        const d = doc.data() as { name: string; email: string; status?: string }
        return {
          name: d.name,
          email: d.email,
          status: d.status || "Offline",
        }
      })
      setMembers(membersData)
    }
    fetchData()
  }, [])

  // Function to assign consistent color from email
  const getColorForEmail = (email: string) => {
    const charCode = email.charCodeAt(0) || 0
    return avatarColors[charCode % avatarColors.length]
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Team Collaboration
        </h3>
        <Button onClick={() => setIsModalOpen(true)} variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-1" />
          Add Member
        </Button>
      </div>

      <div className="space-y-4">
        {members.map((member, index) => {
          const avatarLetter = member.email.charAt(0).toUpperCase()
          const avatarColor = getColorForEmail(member.email)

          return (
            <div key={index} className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 ${avatarColor} rounded-full flex items-center justify-center text-white text-lg font-bold`}
              >
                {avatarLetter}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{member.name}</p>
                <p className="text-xs text-gray-500 truncate">{member.email}</p>
              </div>
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  statusColors[member.status as keyof typeof statusColors]
                }`}
              >
                {member.status}
              </span>
            </div>
          )
        })}
      </div>
      <SignUpModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Card>
  )
}
