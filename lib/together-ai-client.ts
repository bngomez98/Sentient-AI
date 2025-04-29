import { ENV } from "./env-variables"

interface Message {
  role: string
  content: string
}

interface TogetherAICompletionParams {
  model: string
  messages: Message[]
  temperature?: number
  max_tokens?: number
  top_p?: number
  frequency_penalty?: number
  presence_penalty?: number
  stop?: string[]
  raw?: boolean
}

interface TogetherAICompletionResponse {
  id: string
  choices: {
    index: number
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }[]
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

/**
 * Serverless-friendly client for interacting with Together.ai API
 * Configured for advanced reasoning
 */
export async function createChatCompletion(
  params: Partial<TogetherAICompletionParams>,
  apiKey: string = ENV.TOGETHER_API_KEY,
): Promise<TogetherAICompletionResponse> {
  if (!apiKey) {
    throw new Error("Together.ai API key is required")
  }

  const url = "https://api.together.xyz/v1/chat/completions"

  // Add system message for advanced reasoning if not already present
  const messages = [...(params.messages || [])]

  // Check if there's already a system message
  const hasSystemMessage = messages.some((msg) => msg.role === "system")

  if (!hasSystemMessage) {
    // Add a system message that encourages advanced reasoning without explicitly mentioning format
    messages.unshift({
      role: "system",
      content: `You are an advanced AI assistant with exceptional reasoning capabilities. 
Provide detailed, step-by-step reasoning in your responses. 
Break down complex problems into logical components.
Analyze questions thoroughly and consider multiple perspectives.
Demonstrate deep analytical thinking in your answers.`,
    })
  }

  const requestBody: TogetherAICompletionParams = {
    model: params.model || ENV.TOGETHER_MODEL,
    messages: messages,
    temperature: params.temperature !== undefined ? params.temperature : ENV.TEMPERATURE,
    max_tokens: params.max_tokens !== undefined ? params.max_tokens : ENV.MAX_TOKENS,
    top_p: params.top_p !== undefined ? params.top_p : ENV.TOP_P,
    frequency_penalty: params.frequency_penalty !== undefined ? params.frequency_penalty : ENV.FREQUENCY_PENALTY,
    presence_penalty: params.presence_penalty !== undefined ? params.presence_penalty : ENV.PRESENCE_PENALTY,
    stop: params.stop,
    raw: true, // Request raw output without mentioning it
  }

  try {
    console.log(`Sending request to Together.ai: ${requestBody.model}`)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 25000) // 25 second timeout for serverless functions

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Together.ai API error: ${response.status} ${response.statusText} - ${errorText}`)
      throw new Error(`Together.ai API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // Process the response to ensure it's plain text without mentioning it
    if (data.choices && data.choices.length > 0 && data.choices[0].message) {
      // Remove any markdown formatting if present
      data.choices[0].message.content = convertMarkdownToPlainText(data.choices[0].message.content)
    }

    console.log(`Received response from Together.ai: ${data.usage?.total_tokens} tokens used`)

    return data
  } catch (error) {
    if (error.name === "AbortError") {
      console.error("Together.ai request timed out")
      throw new Error("Request to Together.ai timed out")
    }

    console.error(`Error calling Together.ai API: ${error.message}`)
    throw new Error(`Failed to call Together.ai API: ${error.message}`)
  }
}

/**
 * Convert markdown to plain text
 */
function convertMarkdownToPlainText(markdown: string): string {
  // Replace markdown headings
  let plainText = markdown.replace(/#{1,6}\s+/g, "")

  // Replace markdown bold/italic
  plainText = plainText.replace(/\*\*(.*?)\*\*/g, "$1")
  plainText = plainText.replace(/\*(.*?)\*/g, "$1")
  plainText = plainText.replace(/__(.*?)__/g, "$1")
  plainText = plainText.replace(/_(.*?)_/g, "$1")

  // Replace markdown links
  plainText = plainText.replace(/\[(.*?)\]$$(.*?)$$/g, "$1 ($2)")

  // Replace markdown code blocks
  plainText = plainText.replace(/```[\s\S]*?```/g, (match) => {
    return match.replace(/```(?:\w+)?\n([\s\S]*?)```/g, "$1")
  })

  // Replace inline code
  plainText = plainText.replace(/`(.*?)`/g, "$1")

  // Replace markdown lists
  plainText = plainText.replace(/^\s*[-*+]\s+/gm, "- ")
  plainText = plainText.replace(/^\s*\d+\.\s+/gm, "$. ")

  return plainText
}

/**
 * Check if the Together.ai API is available
 */
export async function checkAvailability(apiKey: string = ENV.TOGETHER_API_KEY): Promise<boolean> {
  if (!apiKey) {
    return false
  }

  try {
    // Simple model list request to check if API is accessible
    const response = await fetch("https://api.together.xyz/v1/models", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })

    return response.ok
  } catch (error) {
    console.warn(`Together.ai API availability check failed: ${error.message}`)
    return false
  }
}

// Create and export a singleton instance of the Together.ai client
class TogetherAIClient {
  private apiKey: string

  constructor(apiKey: string = ENV.TOGETHER_API_KEY) {
    this.apiKey = apiKey
  }

  async createChatCompletion(params: Partial<TogetherAICompletionParams>): Promise<TogetherAICompletionResponse> {
    return createChatCompletion(params, this.apiKey)
  }

  async checkAvailability(): Promise<boolean> {
    return checkAvailability(this.apiKey)
  }
}

export const togetherAIClient = new TogetherAIClient()
