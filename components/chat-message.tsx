"use client"
import { Button } from "@/components/ui/button"
import { Info, User, Bot } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  role: "user" | "assistant" | "system"
  content: string
  reasoning?: any
  processingTimes?: {
    preprocessing: number
    llmProcessing: number
    postProcessing: number
    total: number
  }
  images?: string[]
  audio?: string
}

interface ChatMessageProps {
  message: Message
  onShowReasoning?: () => void
  isLast?: boolean
}

export function ChatMessage({ message, onShowReasoning, isLast }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div
      className={cn(
        "flex w-full animate-in fade-in-0 slide-in-from-bottom-3 duration-300",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      <div
        className={cn("flex max-w-[85%] md:max-w-[75%] items-start gap-3", isUser ? "flex-row-reverse" : "flex-row")}
      >
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full border text-sm",
            isUser ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
          )}
        >
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </div>

        <div
          className={cn(
            "flex flex-col space-y-2 overflow-hidden rounded-lg px-4 py-3 text-sm",
            isUser ? "bg-primary text-primary-foreground" : "bg-muted/50 text-foreground border border-border/50",
            isLast && "ring-2 ring-ring/20",
          )}
        >
          {message.images && message.images.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {message.images.map((img, i) => (
                <img
                  key={i}
                  src={img || "/placeholder.svg"}
                  alt={`Uploaded image ${i + 1}`}
                  className="max-w-[200px] max-h-[200px] rounded-md object-cover"
                />
              ))}
            </div>
          )}

          {message.audio && (
            <div className="mb-2">
              <audio controls src={message.audio} className="max-w-full rounded" />
            </div>
          )}

          <div className="whitespace-pre-wrap break-words">{message.content}</div>

          {message.processingTimes && (
            <div className="mt-2 text-xs opacity-70">
              <p>Processing time: {message.processingTimes.total}ms</p>
            </div>
          )}

          {onShowReasoning && (
            <div className="mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onShowReasoning}
                className="text-xs flex items-center opacity-70 hover:opacity-100 -ml-2 h-7 px-2"
              >
                <Info className="h-3 w-3 mr-1" />
                View reasoning
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
