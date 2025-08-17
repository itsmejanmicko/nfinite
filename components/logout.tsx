"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface LogoutConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function LogoutConfirmationDialog({ open, onOpenChange, onConfirm }: LogoutConfirmationDialogProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleConfirm = async () => {
    setIsLoggingOut(true)
    try {
      await onConfirm()
    } finally {
      setIsLoggingOut(false)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <DialogTitle>Confirm Logout</DialogTitle>
              <DialogDescription className="mt-1">
                Are you sure you want to log out? You'll need to sign in again to access your account.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoggingOut}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={isLoggingOut}>
            {isLoggingOut ? "Logging out..." : "Yes, Log out"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
