import { logger } from "./logger"

/**
 * API client for external AI services
 */
export class ApiClient {
  private apiKeys: {
    perplexity: string
    huggingface: string
    openai: string
  }

  constructor() {
    this.apiKeys = {
      perplexity: process.env.PPLX_API_KEY || "",
      huggingface: process.env.HUGGINGFACE_API_TOKEN || "",
      openai: process.env.OPENAI_API_KEY || "",
    }
  }

  /**
   * Validate API keys
   */
  validateApiKeys(): { valid: boolean; missing: string[] } {
    const missing: string[] = []

    if (!this.apiKeys.perplexity) missing.push("PPLX_API_KEY")
    if (!this.apiKeys.huggingface) missing.push("HUGGINGFACE_API_TOKEN")
    if (!this.apiKeys.openai) missing.push("OPENAI_API_KEY")

    return {
      valid: missing.length === 0,
      missing,
    }
  }

  /**
   * Call Perplexity API for chat completions
   */
  async callPerplexityApi(
    messages: any[],
    options: {
      model?: string
      temperature?: number
      maxTokens?: number
      stream?: boolean
    } = {},
  ): Promise<any> {
    if (!this.apiKeys.perplexity) {
      throw new Error("Perplexity API key not configured")
    }

    try {
      const requestBody = {
        model: options.model || "sonar",
        messages,
        max_tokens: options.maxTokens || 4000,
        temperature: options.temperature || 0.7,
        top_p: 0.9,
        top_k: 0,
        stream: options.stream || false,
        presence_penalty: 0,
        frequency_penalty: 1,
      }

      logger.info(`Calling Perplexity API with model: ${requestBody.model}`)

      const response = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKeys.perplexity}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Perplexity API error: ${response.status} - ${errorText}`)
      }

      return await response.json()
    } catch (error) {
      logger.error("Error calling Perplexity API", error)
      throw error
    }
  }

  /**
   * Call Hugging Face API for inference
   */
  async callHuggingFaceApi(
    model: string,
    inputs: any,
    options: {
      waitForModel?: boolean
      useCache?: boolean
      parameters?: any
    } = {},
  ): Promise<any> {
    if (!this.apiKeys.huggingface) {
      throw new Error("Hugging Face API token not configured")
    }

    try {
      const requestBody: any = {
        inputs,
        options: {
          wait_for_model: options.waitForModel ?? true,
          use_cache: options.useCache ?? true,
        },
      }

      if (options.parameters) {
        requestBody.parameters = options.parameters
      }

      logger.info(`Calling Hugging Face API for model: ${model}`)

      const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKeys.huggingface}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        // 503 is acceptable as it means the model is loading
        if (response.status === 503 && options.waitForModel) {
          const retryAfter = response.headers.get("Retry-After") || "5"
          const retryMs = Number.parseInt(retryAfter) * 1000

          logger.info(`Model is loading, retrying after ${retryMs}ms`)

          // Wait for the specified time
          await new Promise((resolve) => setTimeout(resolve, retryMs))

          // Retry the request
          return this.callHuggingFaceApi(model, inputs, options)
        }

        const errorText = await response.text()
        throw new Error(`Hugging Face API error: ${response.status} - ${errorText}`)
      }

      return await response.json()
    } catch (error) {
      logger.error(`Error calling Hugging Face API for model: ${model}`, error)
      throw error
    }
  }

  /**
   * Get dataset from Hugging Face
   */
  async getHuggingFaceDataset(
    dataset: string,
    config = "default",
    split = "train",
    options: {
      offset?: number
      length?: number
    } = {},
  ): Promise<any> {
    try {
      const url = `https://datasets-server.huggingface.co/rows?dataset=${encodeURIComponent(dataset)}&config=${config}&split=${split}&offset=${options.offset || 0}&length=${options.length || 10}`

      logger.info(`Fetching dataset: ${dataset}`)

      const headers: Record<string, string> = {
        Accept: "application/json",
      }

      if (this.apiKeys.huggingface) {
        headers["Authorization"] = `Bearer ${this.apiKeys.huggingface}`
      }

      const response = await fetch(url, {
        method: "GET",
        headers,
        signal: AbortSignal.timeout(10000), // 10 second timeout
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to fetch dataset: ${response.status} - ${errorText}`)
      }

      return await response.json()
    } catch (error) {
      logger.error(`Error fetching dataset: ${dataset}`, error)
      throw error
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

