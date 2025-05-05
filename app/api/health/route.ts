import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check if we have the API key
    if (!process.env.PPLX_API_KEY) {
      console.error("PPLX_API_KEY is not configured")
      return NextResponse.json(
        {
          status: "error",
          message: "API key not configured",
          env_check: false,
        },
        { status: 500 },
      )
    }

    // Try a simple request to the API
    try {
      const response = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.PPLX_API_KEY}`,
        },
        body: JSON.stringify({
          model: "sonar-small-chat", // Updated to a valid model name
          messages: [{ role: "user", content: "Hello" }],
          max_tokens: 1,
        }),
      })

      if (response.ok) {
        return NextResponse.json({
          status: "ok",
          message: "API is available",
          api_check: true,
          env_check: true,
        })
      } else {
        const errorText = await response.text()
        let errorMessage = "Unknown API error"

        try {
          const errorJson = JSON.parse(errorText)
          errorMessage = errorJson.error?.message || "API error: " + response.statusText
        } catch (e) {
          errorMessage = "API error: " + response.statusText
        }

        console.error("API error response:", errorMessage)

        return NextResponse.json(
          {
            status: "error",
            message: errorMessage,
            api_check: false,
            env_check: true,
            status_code: response.status,
          },
          { status: response.status },
        )
      }
    } catch (fetchError: any) {
      console.error("Fetch error:", fetchError)
      return NextResponse.json(
        {
          status: "error",
          message: `API connection error: ${fetchError.message}`,
          api_check: false,
          env_check: true,
          error_type: "fetch",
        },
        { status: 500 },
      )
    }
  } catch (error: any) {
    console.error("Health check error:", error)
    return NextResponse.json(
      {
        status: "error",
        message: `Health check error: ${error.message}`,
        error_stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}

