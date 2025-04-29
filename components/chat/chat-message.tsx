import { cn } from "@/lib/utils"
import { User, Bot } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism"
import type { Message } from "ai"

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex gap-3 max-w-full", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md",
          isUser ? "bg-primary/10 text-primary order-2" : "bg-muted text-muted-foreground",
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      <div
        className={cn(
          "rounded-lg px-4 py-3 max-w-[85%] overflow-x-auto",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted/50 text-foreground border",
        )}
      >
        <ReactMarkdown
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "")
              return !inline && match ? (
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                  wrapLongLines={true}
                  customStyle={{ maxWidth: "100%" }}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code className={cn("bg-muted px-1 py-0.5 rounded text-sm", className)} {...props}>
                  {children}
                </code>
              )
            },
            p({ children }) {
              return <p className="mb-2 last:mb-0">{children}</p>
            },
            ul({ children }) {
              return <ul className="list-disc pl-6 mb-2 last:mb-0">{children}</ul>
            },
            ol({ children }) {
              return <ol className="list-decimal pl-6 mb-2 last:mb-0">{children}</ol>
            },
            li({ children }) {
              return <li className="mb-1">{children}</li>
            },
            h1({ children }) {
              return <h1 className="text-xl font-bold mb-2">{children}</h1>
            },
            h2({ children }) {
              return <h2 className="text-lg font-bold mb-2">{children}</h2>
            },
            h3({ children }) {
              return <h3 className="text-md font-bold mb-2">{children}</h3>
            },
            a({ href, children }) {
              return (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline hover:text-primary/80"
                >
                  {children}
                </a>
              )
            },
            table({ children }) {
              return (
                <div className="overflow-x-auto my-2">
                  <table className="min-w-full divide-y divide-border">{children}</table>
                </div>
              )
            },
            thead({ children }) {
              return <thead className="bg-muted/50">{children}</thead>
            },
            tbody({ children }) {
              return <tbody className="divide-y divide-border">{children}</tbody>
            },
            tr({ children }) {
              return <tr>{children}</tr>
            },
            th({ children }) {
              return <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">{children}</th>
            },
            td({ children }) {
              return <td className="px-3 py-2 whitespace-nowrap">{children}</td>
            },
            blockquote({ children }) {
              return (
                <blockquote className="pl-4 border-l-2 border-muted-foreground/30 italic my-2">{children}</blockquote>
              )
            },
            hr() {
              return <hr className="my-4 border-muted" />
            },
            img({ src, alt }) {
              return (
                <img src={src || "/placeholder.svg"} alt={alt || ""} className="max-w-full h-auto rounded-md my-2" />
              )
            },
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  )
}
