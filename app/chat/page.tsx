import { ChatInterface } from "@/components/chat/chat-interface"

export default function ChatPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-4 px-6">
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Sentient AI Chat</h1>
      </header>

      <main className="flex-1">
        <ChatInterface />
      </main>
    </div>
  )
}

