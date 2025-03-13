"use client"

import { useState } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"

export function Chat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    try {
      // Add user message to the chat
      const userMessage = { role: "user", content: input }
      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)
      setError(null)

      // Clear input
      setInput("")

      // Make API request
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to get response")
      }

      // Handle streaming response
      const data = await response.json()

      // Add AI response to messages
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }])
    } catch (err) {
      console.error("Error in chat:", err)
      setError(err.message || "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col rounded-lg border bg-background h-[600px]">
      <div className="flex-1 overflow-auto p-4">
        {messages.length > 0 ? (
          <div className="flex flex-col gap-4">
            {messages.map((message, index) => (
              <Card
                key={index}
                className={message.role === "user" ? "ml-auto bg-primary text-primary-foreground" : "mr-auto"}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div>
                      <div className="font-semibold">{message.role === "user" ? "You" : "AI Assistant"}</div>
                      <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="max-w-md text-center">
              <h2 className="text-2xl font-bold">Welcome to AI Chatbot</h2>
              <p className="mt-2 text-muted-foreground">Start a conversation with the AI assistant.</p>
            </div>
          </div>
        )}
      </div>
      <div className="border-t p-4">
        {error && (
          <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-700">
            <p>Error: {error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <Textarea
            className="min-h-12 flex-1 resize-none"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
        {isLoading && <p className="text-sm text-muted-foreground mt-2">AI is thinking...</p>}
      </div>
    </div>
  )
}

