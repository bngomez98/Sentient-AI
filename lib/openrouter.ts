const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"

export interface ChatMessage {
  role: "system" | "user" | "assistant"
  content: string
}

export interface OpenRouterResponse {
  id: string
  choices: {
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }[]
  model: string
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export async function chatCompletion(
  messages: ChatMessage[],
  options?: {
    model?: string
    temperature?: number
    max_tokens?: number
  }
): Promise<OpenRouterResponse> {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY environment variable is not set")
  }

  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
      "X-Title": "Sentient AI",
    },
    body: JSON.stringify({
      model: options?.model || "openai/gpt-4o-mini",
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.max_tokens ?? 1024,
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`OpenRouter API error (${response.status}): ${errorBody}`)
  }

  return response.json()
}
