"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ChatMessage } from "./chat-message"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

// Define message type
interface Message {
  role: "user" | "assistant"
  content: string
}

export function HuggingFaceChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null) // Add error state
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
    }

    // Add user message to chat
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setApiError(null) // Clear any previous errors

    // Create an initial assistant message
    const assistantMessageIndex = messages.length
    setMessages((prev) => [...prev, { role: "assistant", content: "" }])

    try {
      // Call the streaming API
      const response = await fetch("/api/huggingface/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          model: "meta-llama/Llama-3.2-3B-Instruct",
          provider: "together",
          maxTokens: 500,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`API returned ${response.status}: ${errorData.error || "Unknown error"}`)
      }

      if (!response.body) {
        throw new Error("Response body is null")
      }

      // Process the stream
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = ""

      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          break
        }

        // Decode the chunk
        const chunk = decoder.decode(value)
        const lines = chunk.split("\n\n")

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6)

            if (data === "[DONE]") {
              continue
            }

            try {
              const parsed = JSON.parse(data)

              if (parsed.content) {
                assistantMessage += parsed.content

                // Update the assistant message
                setMessages((prev) => {
                  const updated = [...prev]
                  updated[assistantMessageIndex] = {
                    role: "assistant",
                    content: assistantMessage,
                  }
                  return updated
                })
              }

              if (parsed.error) {
                throw new Error(parsed.error)
              }
            } catch (e) {
              console.error("Error parsing SSE data:", e)
              setApiError(`Error parsing data: ${e.message}`) // Set error state
              assistantMessage += `[Error parsing data: ${e.message}]`
            }
          }
        }
      }
    } catch (error) {
      console.error("Error in streaming chat:", error)
      setApiError(`Failed to get response: ${error.message}`) // Set error state

      // Update the assistant message with an error
      setMessages((prev) => {
        const updated = [...prev]
        updated[assistantMessageIndex] = {
          role: "assistant",
          content:
            "I apologize, but I encountered an error processing your request. Please try again or rephrase your question.",
        }
        return updated
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Format the model name for display
  const formatModelName = (modelName: string): string => {
    // Remove vendor prefixes if present
    const cleanName = modelName.replace("meta-llama/", "")

    // Capitalize and clean up
    return cleanName
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ")
  }

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-4rem)] bg-background">
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <h2 className="text-2xl font-bold mb-2">Welcome to HuggingFace Chat</h2>
            <p className="text-muted-foreground mb-4">
              I'm powered by {formatModelName("meta-llama/Llama-3.2-3B-Instruct")}. Ask me anything!
            </p>
          </div>
        ) : (
          messages.map((message, index) => <ChatMessage key={index} message={message} />)
        )}
        <div ref={messagesEndRef} />
        {apiError && ( // Display error message
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{apiError}</AlertDescription>
          </Alert>
        )}
        {isLoading && ( // Display loading indicator
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Thinking...</span>
          </div>
        )}
      </div>

      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}

// Add a default export for the ChatInterface component
export default HuggingFaceChat
