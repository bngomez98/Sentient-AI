import { cn } from "@/lib/utils"
import type { Message } from "ai"
import { User, Bot } from "lucide-react"

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div
      className={cn(
        "flex items-start gap-4 rounded-lg p-4",
        isUser
          ? "bg-slate-200 dark:bg-slate-800"
          : "bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600",
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md",
          isUser
            ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
            : "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800",
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div className="flex-1 space-y-2">
        <div className="font-medium text-slate-900 dark:text-slate-100">{isUser ? "You" : "AI Assistant"}</div>
        <div className="text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">{message.content}</div>
      </div>
    </div>
  )
}

