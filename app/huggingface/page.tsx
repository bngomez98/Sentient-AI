import HuggingFaceChat from "@/components/chat/huggingface-chat"

export default function HuggingFacePage() {
  return (
    <main className="flex flex-col min-h-screen">
      <div className="flex-1">
        <HuggingFaceChat />
      </div>
    </main>
  )
}
