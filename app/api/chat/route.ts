import { NextRequest, NextResponse } from "next/server"
import { chatCompletion, type ChatMessage } from "@/lib/openrouter"

const SYSTEM_PROMPT = `You are a knowledgeable assistant for Fresh 535, a nonpartisan movement advocating for congressional accountability and democratic renewal. You help users understand:
- How congressional incumbency advantage undermines accountability
- The Fresh 535 strategy for replacing all 535 members of Congress
- Campaign finance, lobbying data, and voting records
- How citizens can get involved in their local districts

Be factual, cite data when possible, and remain nonpartisan. Keep responses concise and actionable.`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages } = body as { messages?: ChatMessage[] }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "messages array is required" },
        { status: 400 }
      )
    }

    for (const msg of messages) {
      if (!msg.role || !msg.content || typeof msg.content !== "string") {
        return NextResponse.json(
          { error: "Each message must have a role and content string" },
          { status: 400 }
        )
      }
      if (!["system", "user", "assistant"].includes(msg.role)) {
        return NextResponse.json(
          { error: "Invalid message role" },
          { status: 400 }
        )
      }
    }

    const fullMessages: ChatMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages,
    ]

    const response = await chatCompletion(fullMessages)

    const assistantMessage = response.choices?.[0]?.message?.content
    if (!assistantMessage) {
      return NextResponse.json(
        { error: "No response from model" },
        { status: 502 }
      )
    }

    return NextResponse.json({
      message: assistantMessage,
      model: response.model,
      usage: response.usage,
    })
  } catch (error) {
    console.error("Chat API error:", error)

    if (error instanceof Error && error.message.includes("OPENROUTER_API_KEY")) {
      return NextResponse.json(
        { error: "AI service is not configured" },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    )
  }
}
