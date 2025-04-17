import { NextResponse } from "next/server"
import { ENV } from "@/lib/env-variables"
import { logger } from "@/lib/logger"

export const runtime = "nodejs"

export async function GET() {
  const results = {
    timestamp: new Date().toISOString(),
    apis: {
      perplexity: await testPerplexityAPI(),
      openai: await testOpenAIAPI(),
      huggingface: await testHuggingFaceAPI(),
    },
  }

  return NextResponse.json(results)
}

async function testPerplexityAPI() {
  if (!ENV.PPLX_API_KEY) {
    return { status: "not_configured", message: "API key not provided" }
  }

  try {
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ENV.PPLX_API_KEY}`,
      },
      body: JSON.stringify({
        model: ENV.PPLX_MODEL,
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: "Say hello" },
        ],
        max_tokens: 10,
        stream: false,
      }),
    })

    if (response.ok) {
      const data = await response.json()
      return {
        status: "success",
        model: data.model,
        response: data.choices[0].message.content.substring(0, 20) + "...",
      }
    } else {
      const errorText = await response.text()
      return {
        status: "error",
        statusCode: response.status,
        message: errorText.substring(0, 100),
      }
    }
  } catch (error) {
    logger.error("Perplexity API test failed", error)
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

async function testOpenAIAPI() {
  if (!ENV.OPENAI_API_KEY) {
    return { status: "not_configured", message: "API key not provided" }
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ENV.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: ENV.OPENAI_MODEL,
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: "Say hello" },
        ],
        max_tokens: 10,
      }),
    })

    if (response.ok) {
      const data = await response.json()
      return {
        status: "success",
        model: data.model,
        response: data.choices[0].message.content.substring(0, 20) + "...",
      }
    } else {
      const errorText = await response.text()
      return {
        status: "error",
        statusCode: response.status,
        message: errorText.substring(0, 100),
      }
    }
  } catch (error) {
    logger.error("OpenAI API test failed", error)
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

async function testHuggingFaceAPI() {
  if (!ENV.HUGGINGFACE_API_TOKEN) {
    return { status: "not_configured", message: "API token not provided" }
  }

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/gpt2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ENV.HUGGINGFACE_API_TOKEN}`,
      },
      body: JSON.stringify({
        inputs: "Hello, I'm a language model",
        parameters: {
          max_length: 20,
        },
      }),
    })

    if (response.ok) {
      const data = await response.json()
      return {
        status: "success",
        response: data[0].generated_text.substring(0, 20) + "...",
      }
    } else {
      const errorText = await response.text()
      return {
        status: "error",
        statusCode: response.status,
        message: errorText.substring(0, 100),
      }
    }
  } catch (error) {
    logger.error("Hugging Face API test failed", error)
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

