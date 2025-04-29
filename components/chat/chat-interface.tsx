"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useChat, type Message } from "ai/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, AlertCircle, Loader2, ChevronDown, Settings, Save, Trash2, Download } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { ChatMessage } from "./chat-message"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export interface ChatMessageWithMetadata extends Message {
  id?: string
  createdAt?: Date
}

interface ChatSession {
  id: string
  title: string
  messages: ChatMessageWithMetadata[]
  createdAt: Date
  updatedAt: Date
}

export function ChatInterface() {
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [autoScroll, setAutoScroll] = useState(true)
  const { toast } = useToast()
  const [chatId, setChatId] = useState<string>(() => crypto.randomUUID())
  const [savedChats, setSavedChats] = useLocalStorage<Record<string, ChatSession>>("saved-chats", {})
  const [showSettings, setShowSettings] = useState(false)
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(1000)
  const [model, setModel] = useState("gpt-4o")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showSavedChats, setShowSavedChats] = useState(false)

  // Use the useChat hook with enhanced options
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    append,
    setMessages,
    isLoading: aiLoading,
    error,
  } = useChat({
    api: "/api/chat",
    id: chatId,
    body: {
      chatId,
      temperature,
      maxTokens,
      model,
    },
    onResponse: () => {
      setIsLoading(false)
      setApiError(null)
    },
    onError: (error) => {
      console.error("Chat error:", error)
      setIsLoading(false)
      setApiError(error.message)
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      })
    },
  })

  // Convert messages to include metadata
  const messagesWithMetadata: ChatMessageWithMetadata[] = messages.map((msg) => ({
    ...msg,
    id: msg.id || crypto.randomUUID(),
    createdAt: msg.createdAt ? new Date(msg.createdAt) : new Date(),
  }))

  // Save chat to local storage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      const chatSession: ChatSession = {
        id: chatId,
        title: getSessionTitle(messages),
        messages: messagesWithMetadata,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      setSavedChats((prev) => ({
        ...prev,
        [chatId]: chatSession,
      }))

      // Also save to server if available
      saveChatToServer(chatSession).catch((err) => {
        console.error("Failed to save chat to server:", err)
      })
    }
  }, [messages, chatId, setSavedChats])

  // Function to save chat to server
  const saveChatToServer = async (chatSession: ChatSession) => {
    try {
      const response = await fetch("/api/chat/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(chatSession),
      })

      if (!response.ok) {
        throw new Error("Failed to save chat")
      }

      return await response.json()
    } catch (error) {
      console.error("Error saving chat:", error)
      // Continue even if server save fails - we have local storage as backup
    }
  }

  // Function to get a title from the first user message
  const getSessionTitle = (messages: Message[]): string => {
    const firstUserMessage = messages.find((m) => m.role === "user")
    if (firstUserMessage) {
      const content = firstUserMessage.content.trim()
      return content.length > 30 ? content.substring(0, 30) + "..." : content
    }
    return `Chat ${new Date().toLocaleString()}`
  }

  // Scroll to bottom when messages change if autoScroll is enabled
  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, autoScroll])

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Handle form submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() || isLoading) return

    setIsLoading(true)
    setApiError(null)
    setAutoScroll(true)

    try {
      handleSubmit(e)
    } catch (err) {
      console.error("Error sending message:", err)
      setApiError(`Failed to get response: ${err instanceof Error ? err.message : String(err)}`)
      setIsLoading(false)
    }
  }

  // Start a new chat
  const startNewChat = () => {
    const newChatId = crypto.randomUUID()
    setChatId(newChatId)
    setMessages([])
    setApiError(null)
    setIsLoading(false)
    inputRef.current?.focus()
    toast({
      title: "New conversation started",
      description: "Your previous conversation has been saved.",
    })
  }

  // Save current chat
  const saveChat = async () => {
    if (messages.length === 0) {
      toast({
        title: "Nothing to save",
        description: "Start a conversation first before saving.",
        variant: "destructive",
      })
      return
    }

    const chatSession: ChatSession = {
      id: chatId,
      title: getSessionTitle(messages),
      messages: messagesWithMetadata,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setSavedChats((prev) => ({
      ...prev,
      [chatId]: chatSession,
    }))

    try {
      await saveChatToServer(chatSession)
      toast({
        title: "Conversation saved",
        description: "Your conversation has been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Saved locally only",
        description: "Could not save to server, but saved in your browser.",
        variant: "default",
      })
    }
  }

  // Load a saved chat
  const loadChat = (id: string) => {
    const chat = savedChats[id]
    if (chat) {
      setChatId(id)
      setMessages(chat.messages)
      setShowSavedChats(false)
      toast({
        title: "Conversation loaded",
        description: `Loaded: ${chat.title}`,
      })
    }
  }

  // Delete current chat
  const deleteChat = async () => {
    try {
      // Try to delete from server first
      await fetch(`/api/chat/${chatId}`, {
        method: "DELETE",
      })

      // Then remove from local storage
      setSavedChats((prev) => {
        const newChats = { ...prev }
        delete newChats[chatId]
        return newChats
      })

      // Start a new chat
      startNewChat()

      toast({
        title: "Conversation deleted",
        description: "The conversation has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting chat:", error)

      // Even if server delete fails, remove from local storage
      setSavedChats((prev) => {
        const newChats = { ...prev }
        delete newChats[chatId]
        return newChats
      })

      startNewChat()

      toast({
        title: "Conversation deleted locally",
        description: "Could not delete from server, but removed from browser.",
      })
    } finally {
      setShowDeleteDialog(false)
    }
  }

  // Export chat as JSON
  const exportChat = () => {
    if (messages.length === 0) {
      toast({
        title: "Nothing to export",
        description: "Start a conversation first before exporting.",
        variant: "destructive",
      })
      return
    }

    const chatData = savedChats[chatId]
    const dataStr = JSON.stringify(chatData, null, 2)
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

    const exportFileDefaultName = `chat-${chatId.substring(0, 8)}-${new Date().toISOString().slice(0, 10)}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()

    toast({
      title: "Conversation exported",
      description: "Your conversation has been exported as JSON.",
    })
  }

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    setAutoScroll(true)
  }

  // Handle scroll events to detect when user scrolls up
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    // If user scrolls up more than 100px from bottom, disable auto-scroll
    setAutoScroll(scrollHeight - scrollTop - clientHeight < 100)
  }

  // Apply settings
  const applySettings = () => {
    setShowSettings(false)
    toast({
      title: "Settings applied",
      description: "Your chat settings have been updated.",
    })
  }

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] bg-background rounded-lg border shadow-sm">
      {/* Chat header */}
      <div className="border-b p-4 flex items-center justify-between bg-muted/30">
        <div>
          <h2 className="font-semibold text-lg">AI Assistant</h2>
          <p className="text-sm text-muted-foreground">
            {messages.length > 0 ? `${messages.length} messages` : "Start a new conversation"}
          </p>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Chat Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowSettings(true)}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={saveChat}>
                <Save className="mr-2 h-4 w-4" />
                <span>Save Chat</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowSavedChats(true)}>
                <ChevronDown className="mr-2 h-4 w-4" />
                <span>Load Saved Chat</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={startNewChat}>
                <Settings className="mr-2 h-4 w-4" />
                <span>New Chat</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportChat}>
                <Download className="mr-2 h-4 w-4" />
                <span>Export Chat</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-red-500 focus:text-red-500">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete Chat</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" onScroll={handleScroll}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <h2 className="text-2xl font-bold mb-2">Welcome to Sentient AI</h2>
            <p className="text-muted-foreground mb-6">
              I'm powered by advanced AI models with enhanced reasoning capabilities. Ask me anything!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-md">
              {[
                "How does quantum computing work?",
                "Write a short poem about technology",
                "Explain machine learning to a 10-year-old",
                "What are the ethical implications of AI?",
              ].map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  className="justify-start text-left h-auto py-2 px-3"
                  onClick={() => {
                    handleInputChange({ target: { value: suggestion } } as any)
                    inputRef.current?.focus()
                  }}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          messagesWithMetadata.map((message, index) => (
            <div key={message.id || index} className="message-container">
              <ChatMessage message={message} />
              <div className="text-xs text-muted-foreground mt-1 flex items-center">
                <span>
                  {message.createdAt
                    ? formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })
                    : "Just now"}
                </span>
                {message.role === "assistant" && (
                  <Badge variant="outline" className="ml-2 text-xs">
                    AI
                  </Badge>
                )}
              </div>
            </div>
          ))
        )}

        {apiError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{apiError}</AlertDescription>
          </Alert>
        )}

        {isLoading && (
          <div className="flex items-center p-4 bg-muted/30 rounded-lg">
            <Loader2 className="h-5 w-5 animate-spin text-primary mr-2" />
            <span className="text-sm">AI is thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to bottom button - only show when not at bottom */}
      {!autoScroll && messages.length > 3 && (
        <Button
          variant="outline"
          size="icon"
          className="absolute bottom-20 right-8 rounded-full shadow-md"
          onClick={scrollToBottom}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      )}

      {/* Chat input */}
      <div className="border-t p-4 bg-background">
        <form onSubmit={handleFormSubmit} className="flex space-x-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleFormSubmit(e)
              }
            }}
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className={cn("transition-all", input.trim() ? "opacity-100" : "opacity-70")}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
        <div className="mt-2 text-xs text-muted-foreground text-center">
          <p>Press Enter to send, Shift+Enter for new line</p>
        </div>
      </div>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Chat Settings</DialogTitle>
            <DialogDescription>Configure the AI model and response parameters.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="model" className="text-right">
                Model
              </Label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                  <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                  <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="temperature" className="text-right">
                Temperature
              </Label>
              <div className="col-span-3 flex items-center gap-2">
                <Input
                  id="temperature"
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(Number.parseFloat(e.target.value))}
                  className="flex-1"
                />
                <span className="w-12 text-center">{temperature}</span>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="maxTokens" className="text-right">
                Max Tokens
              </Label>
              <Input
                id="maxTokens"
                type="number"
                value={maxTokens}
                onChange={(e) => setMaxTokens(Number.parseInt(e.target.value))}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={applySettings}>
              Apply Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Conversation</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this conversation? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteChat}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Saved Chats Dialog */}
      <Dialog open={showSavedChats} onOpenChange={setShowSavedChats}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Saved Conversations</DialogTitle>
            <DialogDescription>Select a conversation to load.</DialogDescription>
          </DialogHeader>
          <div className="max-h-[300px] overflow-y-auto">
            {Object.keys(savedChats).length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">No saved conversations found.</p>
            ) : (
              <div className="space-y-2">
                {Object.entries(savedChats).map(([id, chat]) => (
                  <div
                    key={id}
                    className="flex items-center justify-between p-3 border rounded-md hover:bg-muted cursor-pointer"
                    onClick={() => loadChat(id)}
                  >
                    <div>
                      <p className="font-medium truncate max-w-[300px]">{chat.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {chat.messages.length} messages • {new Date(chat.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      Load
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSavedChats(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ChatInterface
