"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LoginDialog } from "./login-dialog"
import { RegisterDialog } from "./register-dialog"
import { useAuth } from "@/contexts/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogIn, LogOut, User, Settings } from "lucide-react"

export function AuthButton() {
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [showRegisterDialog, setShowRegisterDialog] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()

  const handleLoginClick = () => {
    setShowLoginDialog(true)
    setShowRegisterDialog(false)
  }

  const handleRegisterClick = () => {
    setShowRegisterDialog(true)
    setShowLoginDialog(false)
  }

  const handleCloseDialogs = () => {
    setShowLoginDialog(false)
    setShowRegisterDialog(false)
  }

  if (isAuthenticated) {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <User className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>
              <User className="mr-2 h-4 w-4" />
              <span>{user?.username}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => (window.location.href = "/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </>
    )
  }

  return (
    <>
      <Button variant="ghost" size="sm" onClick={handleLoginClick}>
        <LogIn className="mr-2 h-4 w-4" />
        Login
      </Button>
      <LoginDialog isOpen={showLoginDialog} onClose={handleCloseDialogs} onSwitchToRegister={handleRegisterClick} />
      <RegisterDialog isOpen={showRegisterDialog} onClose={handleCloseDialogs} onSwitchToLogin={handleLoginClick} />
    </>
  )
}

