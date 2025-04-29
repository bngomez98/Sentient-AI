import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900">
      <header className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Sentient AI</h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link
                  href="/"
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/chat"
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
                >
                  Chat
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">About Sentient AI</h2>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-lg mb-6">
              Sentient AI is an advanced artificial intelligence platform designed to provide natural, helpful, and
              accurate responses to your questions and requests.
            </p>

            <h3 className="text-xl font-semibold mt-8 mb-4">Our Technology</h3>
            <p>Our AI is built on state-of-the-art large language models, enhanced with:</p>
            <ul>
              <li>Advanced reasoning capabilities</li>
              <li>Knowledge retrieval systems</li>
              <li>Continuous learning mechanisms</li>
              <li>Context-aware responses</li>
            </ul>

            <h3 className="text-xl font-semibold mt-8 mb-4">Our Mission</h3>
            <p>
              We aim to make artificial intelligence accessible, helpful, and safe for everyone. Our goal is to assist
              users in finding information, solving problems, and exploring ideas through natural conversation.
            </p>

            <h3 className="text-xl font-semibold mt-8 mb-4">Get Started</h3>
            <p>
              Experience Sentient AI by starting a conversation in our chat interface. Ask questions, request
              information, or just have a friendly conversation.
            </p>
          </div>

          <div className="mt-8">
            <Link href="/chat">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Start Chatting</Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-6 px-6">
        <div className="container mx-auto text-center text-slate-600 dark:text-slate-400">
          <p>© {new Date().getFullYear()} Sentient AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
