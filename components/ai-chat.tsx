"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useChat } from "ai/react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Send,
  AlertCircle,
  Trash2,
  BarChart2,
  FileText,
  MessageSquare,
  Layers,
  Sparkles,
  RefreshCw,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Badge } from "@/components/ui/badge"
import { SentimentResult } from "@/components/sentiment-result"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"
import FallbackChat from "@/components/fallback-chat"

// Basic sentiment analysis function
function basicSentimentAnalysis(text: string) {
  const positiveWords = [
    "good",
    "great",
    "excellent",
    "amazing",
    "love",
    "happy",
    "best",
    "fantastic",
    "wonderful",
    "enjoy",
    "like",
    "positive",
    "beautiful",
    "perfect",
    "awesome",
    "brilliant",
    "delightful",
    "pleasant",
    "glad",
    "satisfied",
    "impressive",
    "exceptional",
    "superb",
    "outstanding",
  ]
  const negativeWords = [
    "bad",
    "terrible",
    "awful",
    "horrible",
    "hate",
    "sad",
    "worst",
    "poor",
    "negative",
    "dislike",
    "disappointed",
    "unfortunate",
    "ugly",
    "boring",
    "annoying",
    "frustrating",
    "unpleasant",
    "angry",
    "upset",
    "inferior",
    "mediocre",
    "dreadful",
    "disgusting",
    "offensive",
  ]

  const words = text.toLowerCase().split(/\W+/)
  let positiveCount = 0
  let negativeCount = 0

  words.forEach((word) => {
    if (positiveWords.includes(word)) positiveCount++
    if (negativeWords.includes(word)) negativeCount++
  })

  const sentiment = positiveCount >= negativeCount ? "positive" : "negative"
  const total = positiveCount + negativeCount || 1
  const confidence = sentiment === "positive" ? positiveCount / total : negativeCount / total

  return {
    text,
    sentiment,
    confidence: Math.max(0.5, confidence),
    sentiment_score: sentiment === "positive" ? confidence : -confidence,
  }
}

// Basic text classification function
function basicTextClassification(text: string) {
  const categories = {
    technology: [
      "computer",
      "software",
      "hardware",
      "tech",
      "digital",
      "internet",
      "code",
      "programming",
      "app",
      "data",
      "algorithm",
      "ai",
      "artificial intelligence",
    ],
    business: [
      "company",
      "market",
      "finance",
      "investment",
      "stock",
      "economy",
      "business",
      "startup",
      "entrepreneur",
      "profit",
      "revenue",
      "corporate",
    ],
    health: [
      "health",
      "medical",
      "doctor",
      "patient",
      "disease",
      "treatment",
      "medicine",
      "hospital",
      "wellness",
      "fitness",
      "diet",
      "exercise",
    ],
    entertainment: [
      "movie",
      "film",
      "music",
      "game",
      "play",
      "entertainment",
      "actor",
      "actress",
      "director",
      "show",
      "television",
      "tv",
      "celebrity",
    ],
    science: [
      "science",
      "research",
      "study",
      "experiment",
      "discovery",
      "scientist",
      "theory",
      "physics",
      "chemistry",
      "biology",
      "laboratory",
    ],
  }

  const words = text.toLowerCase().split(/\W+/)
  const scores: Record<string, number> = {}

  Object.keys(categories).forEach((category) => {
    scores[category] = 0
    words.forEach((word) => {
      if ((categories as any)[category].includes(word)) {
        scores[category]++
      }
    })
  })

  let topCategory = Object.keys(scores)[0]
  let topScore = scores[topCategory]

  Object.keys(scores).forEach((category) => {
    if (scores[category] > topScore) {
      topCategory = category
      topScore = scores[category]
    }
  })

  const total = Object.values(scores).reduce((sum, score) => sum + score, 0) || 1
  const confidence = topScore / total

  return {
    text,
    category: topCategory,
    confidence: Math.max(0.4, confidence),
    scores,
  }
}

// Basic text summarization function
function basicTextSummarization(text: string) {
  // Split text into sentences
  const sentences = text.match(/[^.!?]+[.!?]+/g) || []
  if (sentences.length <= 3) return text

  // Score sentences based on word frequency
  const wordFrequency: Record<string, number> = {}
  const words = text
    .toLowerCase()
    .split(/\W+/)
    .filter((word) => word.length > 3)

  words.forEach((word) => {
    wordFrequency[word] = (wordFrequency[word] || 0) + 1
  })

  const sentenceScores = sentences.map((sentence) => {
    const sentenceWords = sentence
      .toLowerCase()
      .split(/\W+/)
      .filter((word) => word.length > 3)
    let score = 0
    sentenceWords.forEach((word) => {
      if (wordFrequency[word]) score += wordFrequency[word]
    })
    return { sentence, score: score / sentenceWords.length }
  })

  // Sort sentences by score and take top 3
  const topSentences = sentenceScores
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .sort((a, b) => {
      return sentences.indexOf(a.sentence) - sentences.indexOf(b.sentence)
    })
    .map((item) => item.sentence)

  return topSentences.join(" ")
}

// Types for analysis results
type AnalysisResult = {
  type: "sentiment" | "classification" | "summary" | "entities"
  data: any
}

export default function AIChat() {
  const [inputValue, setInputValue] = useState("")
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([])
  const [activeTab, setActiveTab] = useState("chat")
  const [activeAnalysisIndex, setActiveAnalysisIndex] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const [apiAvailable, setApiAvailable] = useState(true)
  const [isCheckingAPI, setIsCheckingAPI] = useState(false)

  const { messages, input, handleInputChange, handleSubmit, isLoading, error, reload, stop, setMessages } = useChat({
    api: "/api/chat",
    onFinish: () => {
      scrollToBottom()
    },
    onError: (error) => {
      console.error("Chat error:", error)

      // Check if the error is related to API connectivity
      if (
        error.message?.includes("API") ||
        error.message?.includes("network") ||
        error.message?.includes("key not configured") ||
        error.message?.includes("Internal server error")
      ) {
        setApiAvailable(false)
        toast({
          title: "API Unavailable",
          description: "Switching to fallback mode with limited functionality.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to communicate with the AI. Please try again.",
          variant: "destructive",
        })
      }
    },
  })

  const scrollToBottom = () => {
    if (messagesEndRef?.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Check API health on component mount
  useEffect(() => {
    checkApiHealth()
  }, [])

  const checkApiHealth = async () => {
    try {
      setIsCheckingAPI(true)
      const response = await fetch("/api/health")

      if (response.ok) {
        const data = await response.json()
        if (data.status === "ok") {
          setApiAvailable(true)
        } else {
          setApiAvailable(false)
          toast({
            title: "API Unavailable",
            description: data.message || "The AI service is currently unavailable.",
            variant: "destructive",
          })
        }
      } else {
        setApiAvailable(false)
      }
    } catch (error) {
      console.error("Health check error:", error)
      setApiAvailable(false)
    } finally {
      setIsCheckingAPI(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      const form = e.currentTarget.form
      if (form) form.requestSubmit()
    }
  }

  const analyzeSentiment = (text: string) => {
    const result = basicSentimentAnalysis(text)
    const newResults = [...analysisResults, { type: "sentiment", data: result }]
    setAnalysisResults(newResults)
    setActiveAnalysisIndex(newResults.length - 1)
    setActiveTab("analysis")
    toast({
      title: "Sentiment Analysis Complete",
      description: `Text analyzed as ${result.sentiment} with ${Math.round(result.confidence * 100)}% confidence.`,
    })
  }

  const classifyText = (text: string) => {
    const result = basicTextClassification(text)
    const newResults = [...analysisResults, { type: "classification", data: result }]
    setAnalysisResults(newResults)
    setActiveAnalysisIndex(newResults.length - 1)
    setActiveTab("analysis")
    toast({
      title: "Text Classification Complete",
      description: `Text classified as ${result.category} with ${Math.round(result.confidence * 100)}% confidence.`,
    })
  }

  const summarizeText = (text: string) => {
    const result = basicTextSummarization(text)
    const newResults = [...analysisResults, { type: "summary", data: { original: text, summary: result } }]
    setAnalysisResults(newResults)
    setActiveAnalysisIndex(newResults.length - 1)
    setActiveTab("analysis")
    toast({
      title: "Text Summarization Complete",
      description: "Summary generated successfully.",
    })
  }

  const clearChat = () => {
    setMessages([])
    setAnalysisResults([])
    toast({
      title: "Conversation cleared",
      description: "All messages and analysis results have been removed.",
    })
  }

  const retryApiConnection = async () => {
    try {
      setIsCheckingAPI(true)
      toast({
        title: "Checking API Connection",
        description: "Attempting to reconnect to the AI service...",
      })

      await checkApiHealth()

      if (apiAvailable) {
        toast({
          title: "Connection Restored",
          description: "API connection is now available.",
        })
      }
    } catch (error) {
      console.error("Failed to reconnect:", error)
      toast({
        title: "Connection Failed",
        description: "Could not reconnect to the AI service. Using fallback mode.",
        variant: "destructive",
      })
    } finally {
      setIsCheckingAPI(false)
    }
  }

  if (!apiAvailable) {
    return (
      <div className="flex flex-col h-full gap-4">
        <FallbackChat />
        <div className="text-center">
          <Button variant="outline" onClick={retryApiConnection} className="mx-auto" disabled={isCheckingAPI}>
            {isCheckingAPI ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Checking Connection...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry API Connection
              </>
            )}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full gap-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="chat" className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4 mr-1" />
              <span>Chat</span>
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-1">
              <Layers className="h-4 w-4 mr-1" />
              <span>Analysis</span>
              {analysisResults.length > 0 && (
                <Badge variant="outline" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                  {analysisResults.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={clearChat}>
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Clear chat</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Clear conversation</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <TabsContent value="chat" className="flex-1 flex flex-col space-y-4 mt-0 data-[state=inactive]:hidden">
          <Card className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 p-4 pt-0">
              <div className="space-y-4 pt-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[300px] text-center text-muted-foreground">
                    <div className="mb-3">
                      <Sparkles className="h-12 w-12 text-primary/20" />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">Welcome to Insight AI</h3>
                    <p className="max-w-md mb-4">
                      I'm your intelligent assistant. Ask me anything or try one of these capabilities:
                    </p>
                    <div className="grid grid-cols-2 gap-2 w-full max-w-md">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          handleInputChange({
                            target: { value: "Analyze the sentiment of: I really enjoyed this product!" },
                          } as any)
                        }}
                      >
                        <BarChart2 className="h-4 w-4 mr-2" />
                        Sentiment Analysis
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          handleInputChange({
                            target: {
                              value:
                                "Classify this text: The new smartphone features an improved camera and faster processor.",
                            },
                          } as any)
                        }}
                      >
                        <Layers className="h-4 w-4 mr-2" />
                        Text Classification
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          handleInputChange({
                            target: {
                              value:
                                "Summarize this: Artificial intelligence is transforming industries across the global economy. From healthcare and finance to transportation and retail, AI technologies are automating processes, enhancing decision-making, and creating new possibilities. While these advancements offer tremendous benefits, they also raise important questions about privacy, security, and the future of work.",
                            },
                          } as any)
                        }}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Text Summarization
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          handleInputChange({
                            target: { value: "What are the key concepts of machine learning?" },
                          } as any)
                        }}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Ask a Question
                      </Button>
                    </div>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn("flex items-start gap-3 group", message.role === "user" ? "justify-end" : "")}
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

                        {message.role === "user" && (
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-2 flex flex-wrap gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => analyzeSentiment(message.content)}
                              className="text-xs h-6 px-2"
                            >
                              <BarChart2 className="h-3 w-3 mr-1" />
                              Analyze Sentiment
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => classifyText(message.content)}
                              className="text-xs h-6 px-2"
                            >
                              <Layers className="h-3 w-3 mr-1" />
                              Classify Text
                            </Button>
                            {message.content.length > 100 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => summarizeText(message.content)}
                                className="text-xs h-6 px-2"
                              >
                                <FileText className="h-3 w-3 mr-1" />
                                Summarize
                              </Button>
                            )}
                          </div>
                        )}
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
                      <LoadingSpinner />
                    </div>
                  </div>
                )}
                {error && (
                  <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/30 rounded-md flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>Error: {error.message || "Something went wrong. Please try again."}</span>
                    <div className="ml-auto flex gap-2">
                      <Button variant="outline" size="sm" onClick={retryApiConnection}>
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Check API
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => reload()}>
                        Retry
                      </Button>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </Card>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Textarea
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything or try sentiment analysis, classification, or summarization..."
              className="min-h-[60px] flex-1 resize-none"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !input.trim()}
              className="bg-primary hover:bg-primary/90"
            >
              <Send className="h-5 w-5" /> <span className="sr-only">Send message</span>
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="analysis" className="flex-1 flex flex-col space-y-4 mt-0 data-[state=inactive]:hidden">
          <Card className="flex-1 p-6">
            {analysisResults.length > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Analysis Results</h2>
                  <div className="flex gap-1">
                    {analysisResults.map((_, index) => (
                      <Button
                        key={index}
                        variant={activeAnalysisIndex === index ? "default" : "outline"}
                        size="sm"
                        onClick={() => setActiveAnalysisIndex(index)}
                        className="h-8 w-8 p-0"
                      >
                        {index + 1}
                      </Button>
                    ))}
                  </div>
                </div>

                {analysisResults[activeAnalysisIndex].type === "sentiment" && (
                  <SentimentResult result={analysisResults[activeAnalysisIndex].data} usedFallback={true} />
                )}

                {analysisResults[activeAnalysisIndex].type === "classification" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Layers className="h-6 w-6 text-primary" />
                        <h3 className="text-lg font-medium">Text Classification</h3>
                      </div>
                      <Badge variant="outline">AI Analysis</Badge>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Confidence</span>
                        <span className="text-sm font-medium">
                          {Math.round(analysisResults[activeAnalysisIndex].data.confidence * 100)}%
                        </span>
                      </div>
                      <Progress
                        value={Math.round(analysisResults[activeAnalysisIndex].data.confidence * 100)}
                        className="h-2 bg-primary/20"
                      />
                    </div>

                    <div className="p-3 bg-muted rounded-md">
                      <p className="text-sm text-foreground/80 italic">
                        "{analysisResults[activeAnalysisIndex].data.text}"
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">Category Scores</h4>
                      <div className="space-y-2">
                        {Object.entries(analysisResults[activeAnalysisIndex].data.scores).map(
                          ([category, score]: [string, any]) => (
                            <div key={category} className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="capitalize">{category}</span>
                                <span>{score}</span>
                              </div>
                              <Progress
                                value={
                                  score > 0
                                    ? (score /
                                        Object.values(analysisResults[activeAnalysisIndex].data.scores).reduce(
                                          (a: any, b: any) => Math.max(a, b),
                                          0,
                                        )) *
                                      100
                                    : 0
                                }
                                className="h-1 bg-primary/10"
                                indicatorClassName={
                                  category === analysisResults[activeAnalysisIndex].data.category
                                    ? "bg-primary"
                                    : "bg-primary/40"
                                }
                              />
                            </div>
                          ),
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Primary Category</p>
                        <p className="font-medium capitalize">{analysisResults[activeAnalysisIndex].data.category}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Confidence Score</p>
                        <p className="font-medium">{analysisResults[activeAnalysisIndex].data.confidence.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                )}

                {analysisResults[activeAnalysisIndex].type === "summary" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-6 w-6 text-primary" />
                        <h3 className="text-lg font-medium">Text Summarization</h3>
                      </div>
                      <Badge variant="outline">AI Analysis</Badge>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Original Text</h4>
                      <div className="p-3 bg-muted rounded-md max-h-40 overflow-y-auto">
                        <p className="text-sm text-foreground/80">
                          {analysisResults[activeAnalysisIndex].data.original}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Summary</h4>
                      <div className="p-3 border rounded-md">
                        <p className="text-sm">{analysisResults[activeAnalysisIndex].data.summary}</p>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      <p>
                        Compression ratio:{" "}
                        {Math.round(
                          (analysisResults[activeAnalysisIndex].data.summary.length /
                            analysisResults[activeAnalysisIndex].data.original.length) *
                            100,
                        )}
                        %
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex justify-center">
                  <Button onClick={() => setActiveTab("chat")} variant="outline" className="mt-4">
                    Back to Chat
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <Layers className="h-12 w-12 text-primary/20 mb-3" />
                <h3 className="text-lg font-semibold mb-1">No Analysis Yet</h3>
                <p className="max-w-md mb-4">
                  Use the analysis tools on your messages in the chat to see results here.
                </p>
                <Button onClick={() => setActiveTab("chat")} variant="outline">
                  Back to Chat
                </Button>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

