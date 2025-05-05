"use client"

import AIChat from "@/components/ai-chat"
import { ThemeToggle } from "@/components/theme-toggle"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle } from "lucide-react"

export default function Home() {
  const [apiStatus, setApiStatus] = useState<"loading" | "available" | "unavailable">("loading")
  const { toast } = useToast()

  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        const response = await fetch("/api/health")
        if (response.ok) {
          const data = await response.json()
          if (data.status === "ok") {
            setApiStatus("available")
          } else {
            setApiStatus("unavailable")
            toast({
              title: "API Unavailable",
              description: data.message || "The AI service is currently unavailable.",
              variant: "destructive",
            })
          }
        } else {
          setApiStatus("unavailable")
          toast({
            title: "API Check Failed",
            description: "Could not verify AI service availability.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Health check error:", error)
        setApiStatus("unavailable")
      }
    }

    checkApiHealth()
  }, [toast])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-xl">Insight AI</span>
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Multi-Task</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {apiStatus === "unavailable" && (
        <div className="bg-yellow-500/10 border-b border-yellow-500/20 py-2">
          <div className="container flex items-center gap-2 px-4 text-yellow-500">
            <AlertCircle className="h-4 w-4" />
            <p className="text-sm">AI service connectivity issues detected. Some features may be limited.</p>
          </div>
        </div>
      )}

      <main className="flex-1 container mx-auto px-4 py-6 md:py-8 flex flex-col">
        <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
          <AIChat />
        </div>
      </main>

      <footer className="border-t border-border/40 py-3 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Insight AI • Advanced Multi-Task Learning</p>
        </div>
      </footer>
    </div>
  )
}

