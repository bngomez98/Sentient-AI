import { ChatInterface } from "@/components/chat/chat-interface"
import NavBar from "@/components/nav-bar"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI Chat | Sentient-1",
  description: "Chat with our advanced AI assistant with enhanced reasoning capabilities.",
}

export default function ChatPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">AI Assistant</h1>
          <p className="text-muted-foreground mb-6">
            Chat with our advanced AI assistant powered by state-of-the-art language models with enhanced reasoning
            capabilities.
          </p>
          <ChatInterface />
        </div>
      </main>
    </div>
  )
}
