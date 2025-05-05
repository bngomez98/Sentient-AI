"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}

const FALLBACK_RESPONSES = [
  "I'm currently operating in fallback mode due to API connectivity issues.",
  "I can still help with basic tasks like sentiment analysis using local processing.",
  "Try asking me to analyze the sentiment of a text, and I'll process it locally.",
  "You can also try again later when the API connection is restored.",
  "I apologize for the limited functionality at the moment.",
]

export default function FallbackChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const responseIndex = Math.floor(Math.random() * FALLBACK_RESPONSES.length)
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: FALLBACK_RESPONSES[responseIndex],
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)

      toast({
        title: "Fallback Mode Active",
        description: "Using local processing due to API connectivity issues.",
        variant: "destructive",
      })
    }, 1000)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      const form = e.currentTarget.form
      if (form) form.requestSubmit()
    }
  }

  return (
    <div className="flex flex-col h-full">
      <Card className="flex-1 flex flex-col">
        <div className="bg-yellow-500/10 border-b border-yellow-500/20 p-3 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-yellow-500" />
          <p className="text-sm text-yellow-500">
            API connection unavailable. Using fallback mode with limited functionality.
          </p>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[300px] text-center text-muted-foreground">
                <div className="mb-3">
                  <AlertCircle className="h-12 w-12 text-yellow-500/50" />
                </div>
                <h3 className="text-lg font-semibold mb-1">Fallback Mode Active</h3>
                <p className="max-w-md">The AI API is currently unavailable. Limited functionality is available.</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={cn("flex items-start gap-3", message.role === "user" ? "justify-end" : "")}
                >
                  {message.role !== "user" && (
                    <Avatar className="h-8 w-8 border border-primary/10">
                      <AvatarFallback className="bg-primary/10 text-primary">AI</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "rounded-lg px-4 py-2 max-w-[85%] text-sm",
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
                    )}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  </div>
                  {message.role === "user" && (
                    <Avatar className="h-8 w-8 border border-primary/10">
                      <AvatarFallback className="bg-primary/10">You</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8 border border-primary/10">
                  <AvatarFallback className="bg-primary/10 text-primary">AI</AvatarFallback>
                </Avatar>
                <div className="rounded-lg px-4 py-2 max-w-[85%] bg-muted">
                  <div className="flex items-center">
                    <div className="h-2 w-2 bg-primary rounded-full animate-bounce mr-1"></div>
                    <div
                      className="h-2 w-2 bg-primary rounded-full animate-bounce mr-1"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="h-2 w-2 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </Card>

      <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message... (Fallback mode active)"
          className="min-h-[60px] flex-1 resize-none"
          disabled={isLoading}
        />
        <Button
          type="submit"
          size="icon"
          disabled={isLoading || !input.trim()}
          className="bg-primary hover:bg-primary/90"
        >
          <Send className="h-5 w-5" />
          <span className="sr-only">Send message</span>
        </Button>
      </form>
    </div>
  )
}

