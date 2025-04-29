import { logger } from "@/lib/logger"

// Use the PPLX API key from environment variables
const PPLX_API_KEY = process.env.PPLX_API_KEY || "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"

export async function GET() {
  try {
    // Test Perplexity API
    try {
      const requestBody = {
        model: "sonar",
        messages: [
          { role: "system", content: "Be precise and concise." },
          { role: "user", content: "Hello" },
        ],
        max_tokens: 50,
        temperature: 0.2,
        top_p: 0.9,
        top_k: 0,
        stream: false,
        presence_penalty: 0,
        frequency_penalty: 1,
      }

      const pplxResponse = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${PPLX_API_KEY}`,
        },
        body: JSON.stringify(requestBody),
      })

      if (pplxResponse.ok) {
        const data = await pplxResponse.json()
        return new Response(
          JSON.stringify({
            status: "ok",
            message: "Perplexity API is working correctly",
            response: data,
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        )
      } else {
        const errorText = await pplxResponse.text()
        throw new Error(`API error: ${pplxResponse.status} - ${errorText}`)
      }
    } catch (error) {
      throw error
    }
  } catch (error) {
    logger.error("API test failed", error)

    return new Response(
      JSON.stringify({
        status: "error",
        message: "API test failed",
        error: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
