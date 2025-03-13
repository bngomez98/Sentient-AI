"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import {
  Send,
  Settings,
  Sun,
  Moon,
  Trash,
  Download,
  Copy,
  Sparkles,
  X,
  ChevronDown,
  MessageSquare,
  Database,
  Code,
  Brain,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism"

// Message type definition
interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  functionCall?: {
    name: string
    arguments: Record<string, any>
  }
  functionResult?: string
}

// AI Model type
type AIModel = "standard" | "creative" | "precise" | "reasoning"

// Dataset type
type Dataset = "natural_reasoning" | "deepseek_chinese" | "openr1_math"

export default function Home() {
  // State
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)
  const [selectedModel, setSelectedModel] = useState<AIModel>("standard")
  const [temperature, setTemperature] = useState(0.7)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const [showDatasetPanel, setShowDatasetPanel] = useState(false)
  const [selectedDataset, setSelectedDataset] = useState<Dataset>("natural_reasoning")
  const [datasetOffset, setDatasetOffset] = useState(0)
  const [datasetLength, setDatasetLength] = useState(10)
  const [datasetResults, setDatasetResults] = useState<any[]>([])
  const [isLoadingDataset, setIsLoadingDataset] = useState(false)
  const [datasetSample, setDatasetSample] = useState<any>(null)

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Theme
  const { theme, setTheme } = useTheme()

  // Handle scroll to show/hide scroll button
  useEffect(() => {
    const handleScroll = () => {
      if (!chatContainerRef.current) return

      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current
      const isNotAtBottom = scrollHeight - scrollTop - clientHeight > 100
      setShowScrollButton(isNotAtBottom && messages.length > 2)
    }

    const container = chatContainerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll)
      return () => container.removeEventListener("scroll", handleScroll)
    }
  }, [messages.length])

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current && !showScrollButton) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, showScrollButton])

  // Focus input on load
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  // Dynamically determine model based on input content
  useEffect(() => {
    if (!input.trim()) return

    const lowerInput = input.toLowerCase()

    // Only change model if user hasn't explicitly selected one via settings
    if (!showSettings) {
      if (
        lowerInput.includes("explain") ||
        lowerInput.includes("define") ||
        lowerInput.includes("what is") ||
        lowerInput.includes("how does")
      ) {
        setSelectedModel("precise")
      } else if (
        lowerInput.includes("creative") ||
        lowerInput.includes("story") ||
        lowerInput.includes("imagine") ||
        lowerInput.includes("write a")
      ) {
        setSelectedModel("creative")
      } else if (
        lowerInput.includes("solve") ||
        lowerInput.includes("calculate") ||
        lowerInput.includes("reason") ||
        lowerInput.includes("logic")
      ) {
        setSelectedModel("reasoning")
      }
    }
  }, [input, showSettings])

  // Generate a unique ID
  const generateId = () => `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  // Preprocess input for better responses
  const preprocessInput = (input: string) => {
    const processedInput = input.trim()

    // If it's just a single word or very short phrase, expand it
    if (processedInput.split(" ").length <= 2) {
      if (processedInput.toLowerCase() === "calculus") {
        return "Explain calculus in simple terms."
      } else if (processedInput.toLowerCase() === "ai" || processedInput.toLowerCase() === "artificial intelligence") {
        return "Explain what artificial intelligence is and how it works."
      } else if (processedInput.toLowerCase() === "help") {
        return "What can you help me with?"
      }
    }

    return processedInput
  }

  // Handle form submission
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!input.trim() || isLoading) return

    // Preprocess input
    const processedInput = preprocessInput(input)

    // Hide welcome screen when user sends first message
    if (showWelcome) {
      setShowWelcome(false)
    }

    // Add user message to chat
    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content: processedInput,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          model: selectedModel,
          temperature,
        }),
      })

      const data = await response.json()

      // Check if there's a function call in the response
      if (data.functionCall) {
        // Add AI response with function call
        const aiMessage: Message = {
          id: generateId(),
          role: "assistant",
          content: data.response || "I need to perform a function call to answer this properly.",
          timestamp: new Date(),
          functionCall: data.functionCall,
        }

        setMessages((prev) => [...prev, aiMessage])

        // Execute the function
        try {
          const functionResponse = await fetch(`/api/function/${data.functionCall.name}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data.functionCall.arguments),
          })

          const functionData = await functionResponse.json()

          // Add function result message
          const functionResultMessage: Message = {
            id: generateId(),
            role: "assistant",
            content: functionData.result,
            timestamp: new Date(),
            functionResult: functionData.result,
          }

          setMessages((prev) => [...prev, functionResultMessage])
        } catch (functionError) {
          console.error("Function execution error:", functionError)

          // Add function error message
          const functionErrorMessage: Message = {
            id: generateId(),
            role: "assistant",
            content:
              "I encountered an error while trying to execute the function. Let me provide a direct answer instead.",
            timestamp: new Date(),
            functionResult: "Error",
          }

          setMessages((prev) => [...prev, functionErrorMessage])
        }
      } else {
        // Add regular AI response
        const aiMessage: Message = {
          id: generateId(),
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, aiMessage])
      }
    } catch (err) {
      console.error("An error occurred while fetching the response:", err)

      // Silently handle error with a graceful message
      const errorMessage: Message = {
        id: generateId(),
        role: "assistant",
        content:
          "I'm having trouble connecting to my knowledge base. Let me try again in a moment. Please check your internet connection or try rephrasing your query.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Handle input resize
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)

    // Auto-resize textarea
    e.target.style.height = "auto"
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`
  }

  // Handle key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as unknown as React.FormEvent)
    }
  }

  // Clear chat history
  const clearChat = () => {
    setMessages([])
    setShowWelcome(true)
    setShowSettings(false)
  }

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    setShowScrollButton(false)
  }

  // Copy message to clipboard
  const copyMessage = (message: Message) => {
    navigator.clipboard.writeText(message.content)
    setCopiedMessageId(message.id)
    setTimeout(() => setCopiedMessageId(null), 2000)
  }

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Export chat history
  const exportChat = () => {
    const chatText = messages
      .map((m) => `${m.role === "user" ? "You" : "Sentience-1"} (${formatTime(m.timestamp)}):\n${m.content}\n`)
      .join("\n")

    const blob = new Blob([chatText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `sentience-1-chat-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Fetch dataset samples
  const fetchDataset = async () => {
    setIsLoadingDataset(true)
    try {
      const response = await fetch(
        `/api/dataset?dataset=${selectedDataset}&offset=${datasetOffset}&length=${datasetLength}`,
      )
      const data = await response.json()
      setDatasetResults(data.data || [])
    } catch (error) {
      console.error("Error fetching dataset:", error)
      setDatasetResults([])
    } finally {
      setIsLoadingDataset(false)
    }
  }

  // Use dataset sample in chat
  useEffect(() => {
    if (datasetSample) {
      // Extract the question from the dataset sample
      let question = ""

      if (selectedDataset === "natural_reasoning") {
        question = datasetSample.row?.question || "What is natural reasoning?"
      } else if (selectedDataset === "deepseek_chinese") {
        question = datasetSample.row?.instruction || "Translate this to English"
      } else if (selectedDataset === "openr1_math") {
        question = datasetSample.row?.question || "Solve this math problem"
      }

      setInput(question)
      setShowDatasetPanel(false)
      inputRef.current?.focus()
    }
  }, [datasetSample, selectedDataset])

  const useDatasetSample = useCallback(
    (sample: any) => {
      setDatasetSample(sample)
    },
    [setDatasetSample],
  )

  return (
    <div
      className={cn("flex flex-col h-screen", theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900")}
    >
      {/* Header */}
      <header
        className={cn(
          "border-b shadow-sm z-10",
          theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200",
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Sparkles className="h-8 w-8 text-blue-500 mr-2" />
              <div>
                <h1 className="text-xl font-bold">Sentience-1</h1>
                <p className={cn("text-xs", theme === "dark" ? "text-gray-400" : "text-gray-500")}>
                  Neural-Symbolic AI Assistant
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  setShowDatasetPanel(!showDatasetPanel)
                  setShowSettings(false)
                }}
                className={cn(
                  "p-2 rounded-full transition-colors",
                  showDatasetPanel
                    ? "bg-green-100 text-green-600"
                    : theme === "dark"
                      ? "hover:bg-gray-700 text-gray-300"
                      : "hover:bg-gray-100 text-gray-600",
                )}
                aria-label="Dataset Explorer"
              >
                <Database className="h-5 w-5" />
              </button>

              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={cn(
                  "p-2 rounded-full transition-colors",
                  theme === "dark" ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-600",
                )}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              <button
                onClick={() => {
                  setShowSettings(!showSettings)
                  setShowDatasetPanel(false)
                }}
                className={cn(
                  "p-2 rounded-full transition-colors",
                  showSettings
                    ? "bg-blue-100 text-blue-600"
                    : theme === "dark"
                      ? "hover:bg-gray-700 text-gray-300"
                      : "hover:bg-gray-100 text-gray-600",
                )}
                aria-label="Settings"
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col max-w-7xl mx-auto">
          {/* Settings panel */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "overflow-hidden border-b",
                  theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200",
                )}
              >
                <div className="p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Settings</h2>
                    <button
                      onClick={() => setShowSettings(false)}
                      className={cn("p-1 rounded-full", theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100")}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">AI Model</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <button
                          onClick={() => setSelectedModel("standard")}
                          className={cn(
                            "py-2 px-3 rounded-md text-sm font-medium transition-colors",
                            selectedModel === "standard"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                              : theme === "dark"
                                ? "bg-gray-700 hover:bg-gray-600"
                                : "bg-gray-100 hover:bg-gray-200",
                          )}
                        >
                          <div className="flex flex-col items-center">
                            <MessageSquare className="h-5 w-5 mb-1" />
                            <span>Standard</span>
                            <span className="text-xs mt-1">Balanced responses</span>
                          </div>
                        </button>
                        <button
                          onClick={() => setSelectedModel("creative")}
                          className={cn(
                            "py-2 px-3 rounded-md text-sm font-medium transition-colors",
                            selectedModel === "creative"
                              ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                              : theme === "dark"
                                ? "bg-gray-700 hover:bg-gray-600"
                                : "bg-gray-100 hover:bg-gray-200",
                          )}
                        >
                          <div className="flex flex-col items-center">
                            <Sparkles className="h-5 w-5 mb-1" />
                            <span>Creative</span>
                            <span className="text-xs mt-1">Imaginative responses</span>
                          </div>
                        </button>
                        <button
                          onClick={() => setSelectedModel("precise")}
                          className={cn(
                            "py-2 px-3 rounded-md text-sm font-medium transition-colors",
                            selectedModel === "precise"
                              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                              : theme === "dark"
                                ? "bg-gray-700 hover:bg-gray-600"
                                : "bg-gray-100 hover:bg-gray-200",
                          )}
                        >
                          <div className="flex flex-col items-center">
                            <Database className="h-5 w-5 mb-1" />
                            <span>Precise</span>
                            <span className="text-xs mt-1">Factual responses</span>
                          </div>
                        </button>
                        <button
                          onClick={() => setSelectedModel("reasoning")}
                          className={cn(
                            "py-2 px-3 rounded-md text-sm font-medium transition-colors",
                            selectedModel === "reasoning"
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                              : theme === "dark"
                                ? "bg-gray-700 hover:bg-gray-600"
                                : "bg-gray-100 hover:bg-gray-200",
                          )}
                        >
                          <div className="flex flex-col items-center">
                            <Brain className="h-5 w-5 mb-1" />
                            <span>Reasoning</span>
                            <span className="text-xs mt-1">Step-by-step logic</span>
                          </div>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Temperature: {temperature.toFixed(1)}</label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={temperature}
                        onChange={(e) => setTemperature(Number.parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                      />
                      <div className="flex justify-between text-xs mt-1">
                        <span>Precise</span>
                        <span>Balanced</span>
                        <span>Creative</span>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-between">
                      <button
                        onClick={clearChat}
                        className={cn(
                          "flex items-center py-2 px-3 rounded-md text-sm font-medium transition-colors",
                          theme === "dark"
                            ? "bg-red-900 text-red-300 hover:bg-red-800"
                            : "bg-red-100 text-red-700 hover:bg-red-200",
                        )}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Clear Chat
                      </button>

                      <button
                        onClick={exportChat}
                        disabled={messages.length === 0}
                        className={cn(
                          "flex items-center py-2 px-3 rounded-md text-sm font-medium transition-colors",
                          messages.length === 0 ? "opacity-50 cursor-not-allowed" : "",
                          theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200",
                        )}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export Chat
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dataset panel */}
          <AnimatePresence>
            {showDatasetPanel && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "overflow-hidden border-b",
                  theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200",
                )}
              >
                <div className="p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Dataset Explorer</h2>
                    <button
                      onClick={() => setShowDatasetPanel(false)}
                      className={cn("p-1 rounded-full", theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100")}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Dataset</label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <button
                          onClick={() => setSelectedDataset("natural_reasoning")}
                          className={cn(
                            "py-2 px-3 rounded-md text-sm font-medium transition-colors",
                            selectedDataset === "natural_reasoning"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                              : theme === "dark"
                                ? "bg-gray-700 hover:bg-gray-600"
                                : "bg-gray-100 hover:bg-gray-200",
                          )}
                        >
                          Natural Reasoning
                        </button>
                        <button
                          onClick={() => setSelectedDataset("deepseek_chinese")}
                          className={cn(
                            "py-2 px-3 rounded-md text-sm font-medium transition-colors",
                            selectedDataset === "deepseek_chinese"
                              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                              : theme === "dark"
                                ? "bg-gray-700 hover:bg-gray-600"
                                : "bg-gray-100 hover:bg-gray-200",
                          )}
                        >
                          DeepSeek Chinese
                        </button>
                        <button
                          onClick={() => setSelectedDataset("openr1_math")}
                          className={cn(
                            "py-2 px-3 rounded-md text-sm font-medium transition-colors",
                            selectedDataset === "openr1_math"
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                              : theme === "dark"
                                ? "bg-gray-700 hover:bg-gray-600"
                                : "bg-gray-100 hover:bg-gray-200",
                          )}
                        >
                          OpenR1 Math
                        </button>
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Offset</label>
                        <input
                          type="number"
                          min="0"
                          value={datasetOffset}
                          onChange={(e) => setDatasetOffset(Number(e.target.value))}
                          className={cn(
                            "w-24 p-2 rounded-md border",
                            theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300",
                          )}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Length</label>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={datasetLength}
                          onChange={(e) => setDatasetLength(Number(e.target.value))}
                          className={cn(
                            "w-24 p-2 rounded-md border",
                            theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300",
                          )}
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          onClick={fetchDataset}
                          disabled={isLoadingDataset}
                          className={cn(
                            "py-2 px-4 rounded-md text-sm font-medium transition-colors",
                            theme === "dark"
                              ? "bg-blue-600 hover:bg-blue-700 text-white"
                              : "bg-blue-500 hover:bg-blue-600 text-white",
                          )}
                        >
                          {isLoadingDataset ? "Loading..." : "Fetch Samples"}
                        </button>
                      </div>
                    </div>

                    {datasetResults.length > 0 && (
                      <div
                        className={cn(
                          "mt-4 border rounded-md overflow-hidden",
                          theme === "dark" ? "border-gray-700" : "border-gray-200",
                        )}
                      >
                        <div
                          className={cn("max-h-60 overflow-y-auto", theme === "dark" ? "bg-gray-900" : "bg-gray-50")}
                        >
                          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className={cn("sticky top-0", theme === "dark" ? "bg-gray-800" : "bg-gray-100")}>
                              <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                                  Sample
                                </th>
                                <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider w-24">
                                  Action
                                </th>
                              </tr>
                            </thead>
                            <tbody className={cn("divide-y", theme === "dark" ? "divide-gray-700" : "divide-gray-200")}>
                              {datasetResults.map((sample, index) => (
                                <tr key={index} className={cn(theme === "dark" ? "bg-gray-800" : "bg-white")}>
                                  <td className="px-4 py-2 text-sm truncate max-w-xs">
                                    {selectedDataset === "natural_reasoning" && sample.row?.question}
                                    {selectedDataset === "deepseek_chinese" && sample.row?.instruction}
                                    {selectedDataset === "openr1_math" && sample.row?.question}
                                  </td>
                                  <td className="px-4 py-2 text-right">
                                    <button
                                      onClick={() => useDatasetSample(sample)}
                                      className={cn(
                                        "px-2 py-1 text-xs rounded",
                                        theme === "dark"
                                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                                          : "bg-blue-500 hover:bg-blue-600 text-white",
                                      )}
                                    >
                                      Use
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat container */}
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-4 py-6">
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Welcome screen */}
              <AnimatePresence>
                {showWelcome && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={cn("rounded-xl p-6 shadow-lg", theme === "dark" ? "bg-gray-800" : "bg-white")}
                  >
                    <div className="flex justify-center mb-4">
                      <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <Sparkles className="h-8 w-8 text-blue-500" />
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold text-center mb-2">Welcome to Sentience-1</h2>
                    <p className={cn("text-center mb-6", theme === "dark" ? "text-gray-300" : "text-gray-600")}>
                      Your advanced neural-symbolic AI assistant with function calling capabilities
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                      <div className={cn("p-3 rounded-lg", theme === "dark" ? "bg-gray-700" : "bg-gray-50")}>
                        <h3 className="font-medium mb-1">Ask me anything</h3>
                        <p className={cn("text-sm", theme === "dark" ? "text-gray-400" : "text-gray-500")}>
                          Get answers to your questions on any topic
                        </p>
                      </div>
                      <div className={cn("p-3 rounded-lg", theme === "dark" ? "bg-gray-700" : "bg-gray-50")}>
                        <h3 className="font-medium mb-1">Creative writing</h3>
                        <p className={cn("text-sm", theme === "dark" ? "text-gray-400" : "text-gray-500")}>
                          Generate stories, poems, or creative content
                        </p>
                      </div>
                      <div className={cn("p-3 rounded-lg", theme === "dark" ? "bg-gray-700" : "bg-gray-50")}>
                        <h3 className="font-medium mb-1">Function calling</h3>
                        <p className={cn("text-sm", theme === "dark" ? "text-gray-400" : "text-gray-500")}>
                          I can perform calculations and access datasets
                        </p>
                      </div>
                      <div className={cn("p-3 rounded-lg", theme === "dark" ? "bg-gray-700" : "bg-gray-50")}>
                        <h3 className="font-medium mb-1">Step-by-step reasoning</h3>
                        <p className={cn("text-sm", theme === "dark" ? "text-gray-400" : "text-gray-500")}>
                          I can break down complex problems with logical reasoning
                        </p>
                      </div>
                    </div>

                    <div className="text-center">
                      <p className={cn("text-sm mb-2", theme === "dark" ? "text-gray-400" : "text-gray-500")}>
                        Try asking one of these questions:
                      </p>
                      <div className="flex flex-wrap justify-center gap-2">
                        <button
                          onClick={() => {
                            setInput("Calculate the derivative of x^2 + 3x + 5")
                            inputRef.current?.focus()
                          }}
                          className={cn(
                            "text-sm py-1 px-3 rounded-full transition-colors",
                            theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200",
                          )}
                        >
                          Calculate a derivative
                        </button>
                        <button
                          onClick={() => {
                            setInput("Explain neural-symbolic AI")
                            inputRef.current?.focus()
                          }}
                          className={cn(
                            "text-sm py-1 px-3 rounded-full transition-colors",
                            theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200",
                          )}
                        >
                          Explain neural-symbolic AI
                        </button>
                        <button
                          onClick={() => {
                            setInput("Write a short poem about artificial intelligence")
                            inputRef.current?.focus()
                          }}
                          className={cn(
                            "text-sm py-1 px-3 rounded-full transition-colors",
                            theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200",
                          )}
                        >
                          Write a poem
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Messages */}
              <AnimatePresence initial={false}>
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={cn("group flex", message.role === "user" ? "justify-end" : "justify-start")}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] md:max-w-[75%] rounded-xl p-4 shadow-sm",
                        message.role === "user"
                          ? theme === "dark"
                            ? "bg-blue-600 text-white"
                            : "bg-blue-500 text-white"
                          : theme === "dark"
                            ? "bg-gray-800"
                            : "bg-white",
                      )}
                    >
                      <div className="flex items-center mb-1">
                        <div
                          className={cn(
                            "h-6 w-6 rounded-full flex items-center justify-center mr-2",
                            message.role === "user" ? "bg-blue-700" : "bg-blue-100 dark:bg-blue-900",
                          )}
                        >
                          {message.role === "user" ? (
                            <MessageSquare className="h-3 w-3 text-blue-100" />
                          ) : message.functionCall ? (
                            <Code className="h-3 w-3 text-blue-500" />
                          ) : message.functionResult ? (
                            <Database className="h-3 w-3 text-blue-500" />
                          ) : (
                            <Sparkles className="h-3 w-3 text-blue-500" />
                          )}
                        </div>
                        <div className="flex-1 text-xs">
                          {message.role === "user"
                            ? "You"
                            : message.functionCall
                              ? "Sentience-1 (Function Call)"
                              : message.functionResult
                                ? "Sentience-1 (Function Result)"
                                : "Sentience-1"}
                        </div>
                        <div
                          className={cn(
                            "text-xs",
                            message.role === "user"
                              ? "text-blue-200"
                              : theme === "dark"
                                ? "text-gray-500"
                                : "text-gray-400",
                          )}
                        >
                          {formatTime(message.timestamp)}
                        </div>
                      </div>

                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown
                          components={{
                            code({ node, inline, className, children, ...props }) {
                              const match = /language-(\w+)/.exec(className || "")
                              return !inline && match ? (
                                <SyntaxHighlighter style={tomorrow} language={match[1]} PreTag="div" {...props}>
                                  {String(children).replace(/\n$/, "")}
                                </SyntaxHighlighter>
                              ) : (
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              )
                            },
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>

                      {/* Function call details */}
                      {message.functionCall && (
                        <div
                          className={cn(
                            "mt-2 p-2 rounded text-xs font-mono",
                            theme === "dark" ? "bg-gray-900" : "bg-gray-100",
                          )}
                        >
                          <div className="font-semibold">Function: {message.functionCall.name}</div>
                          <div className="mt-1">
                            Arguments: {JSON.stringify(message.functionCall.arguments, null, 2)}
                          </div>
                        </div>
                      )}

                      {/* Message actions */}
                      <div
                        className={cn(
                          "flex justify-end mt-2 opacity-0 group-hover:opacity-100 transition-opacity",
                          message.role === "user"
                            ? "text-blue-200 hover:text-white"
                            : theme === "dark"
                              ? "text-gray-500 hover:text-gray-300"
                              : "text-gray-400 hover:text-gray-600",
                        )}
                      >
                        <button
                          onClick={() => copyMessage(message)}
                          className="p-1 rounded hover:bg-black/10"
                          aria-label="Copy message"
                        >
                          {copiedMessageId === message.id ? (
                            <span className="text-xs">Copied!</span>
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Loading indicator */}
              <AnimatePresence>
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex justify-start"
                  >
                    <div
                      className={cn(
                        "max-w-[85%] md:max-w-[75%] rounded-xl p-4 shadow-sm",
                        theme === "dark" ? "bg-gray-800" : "bg-white",
                      )}
                    >
                      <div className="flex items-center mb-1">
                        <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-2">
                          <Sparkles className="h-3 w-3 text-blue-500" />
                        </div>
                        <div className="flex-1 text-xs">Sentience-1</div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></div>
                        <div
                          className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div
                          className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"
                          style={{ animationDelay: "0.4s" }}
                        ></div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Scroll anchor */}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Scroll to bottom button */}
          <AnimatePresence>
            {showScrollButton && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                onClick={scrollToBottom}
                className={cn(
                  "absolute bottom-24 right-8 p-2 rounded-full shadow-lg",
                  theme === "dark" ? "bg-gray-800" : "bg-white",
                )}
                aria-label="Scroll to bottom"
              >
                <ChevronDown className="h-5 w-5 text-blue-500" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Input area */}
      <div
        className={cn("border-t p-4", theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200")}
      >
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div
            className={cn(
              "flex items-end rounded-xl border overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-blue-500",
              theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300",
            )}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              rows={1}
              className={cn(
                "flex-1 p-3 resize-none focus:outline-none",
                theme === "dark" ? "bg-gray-700 text-white placeholder-gray-400" : "bg-white placeholder-gray-400",
              )}
              style={{ minHeight: "56px", maxHeight: "200px" }}
              disabled={isLoading}
            />

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={cn(
                "p-3 transition-colors",
                !input.trim() || isLoading ? "text-gray-400" : "text-blue-500 hover:text-blue-600",
              )}
              aria-label="Send message"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>

          <div className={cn("text-xs mt-2 text-center", theme === "dark" ? "text-gray-400" : "text-gray-500")}>
            {selectedModel === "standard" && "Using Standard model • Balanced responses"}
            {selectedModel === "creative" && "Using Creative model • More imaginative responses"}
            {selectedModel === "precise" && "Using Precise model • Factual, concise responses"}
            {selectedModel === "reasoning" && "Using Reasoning model • Step-by-step logical analysis"}
            {" • "}Temperature: {temperature.toFixed(1)}
          </div>
        </form>
      </div>
    </div>
  )
}

