"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Send, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Message {
  role: "user" | "assistant" | "system"
  content: string
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<"checking" | "connected" | "error">("checking")

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Check API connection on component mount
  useEffect(() => {
    checkApiConnection()
  }, [])

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [input])

  // Check if the API is available
  const checkApiConnection = async () => {
    try {
      const response = await fetch("/api/health")

      if (response.ok) {
        setConnectionStatus("connected")

        // Add welcome message if no messages exist
        if (messages.length === 0) {
          setMessages([
            {
              role: "assistant",
              content:
                "Hello! I'm an advanced AI assistant with deep reasoning capabilities. How can I help you today?",
            },
          ])
        }
      } else {
        setConnectionStatus("error")
        setError("API service is not available. Please try again later.")
      }
    } catch (err) {
      console.error("API connection check failed:", err)
      setConnectionStatus("error")
      setError("Could not connect to the API. Please check your network connection.")
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() || isLoading) return

    // Clear any previous errors
    setError(null)

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`)
      }

      const data = await response.json()

      if (!data.message) {
        throw new Error("Invalid response format from API")
      }

      setMessages((prev) => [...prev, data.message])
    } catch (err) {
      console.error("Error sending message:", err)

      if (err.name === "AbortError") {
        setError("Request timed out. The server took too long to respond.")
      } else {
        setError(`Failed to get response: ${err.message}`)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[80vh] max-w-3xl mx-auto p-4">
      {connectionStatus === "error" && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription>
            {error || "Could not connect to the chat service. Please try again later."}
          </AlertDescription>
        </Alert>
      )}

      <Card className="flex-grow overflow-hidden mb-4">
        <CardContent className="p-4 h-full overflow-y-auto">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">Start a conversation by sending a message.</div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    message.role === "user" ? "bg-primary text-primary-foreground ml-auto" : "bg-muted mr-auto"
                  } max-w-[80%] whitespace-pre-wrap font-mono`}
                >
                  {message.content}
                </div>
              ))
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {isLoading && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Thinking...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything..."
          disabled={isLoading || connectionStatus === "error"}
          className="flex-grow min-h-[50px] max-h-[200px] resize-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleSubmit(e)
            }
          }}
        />
        <Button type="submit" disabled={isLoading || !input.trim() || connectionStatus === "error"}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
    </div>
  )
}
