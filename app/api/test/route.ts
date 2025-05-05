import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check if API key is available
    if (!process.env.PPLX_API_KEY) {
      return NextResponse.json(
        {
          status: "error",
          message: "API key not configured",
          env_vars: {
            has_pplx_key: process.env.PPLX_API_KEY ? "yes" : "no",
          },
        },
        { status: 500 },
      )
    }

    // Test API connection with valid model
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
          message: "API test endpoint is working",
          api_connection: "successful",
          env_vars: {
            has_pplx_key: process.env.PPLX_API_KEY ? "yes" : "no",
            key_length: process.env.PPLX_API_KEY?.length || 0,
          },
        })
      } else {
        const errorText = await response.text()
        return NextResponse.json({
          status: "error",
          message: "API connection test failed",
          error_details: errorText,
          env_vars: {
            has_pplx_key: process.env.PPLX_API_KEY ? "yes" : "no",
            key_length: process.env.PPLX_API_KEY?.length || 0,
          },
        })
      }
    } catch (error: any) {
      return NextResponse.json(
        {
          status: "error",
          message: `API connection test error: ${error.message || "Unknown error"}`,
          env_vars: {
            has_pplx_key: process.env.PPLX_API_KEY ? "yes" : "no",
            key_length: process.env.PPLX_API_KEY?.length || 0,
          },
        },
        { status: 500 },
      )
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        message: `Test error: ${error.message || "Unknown error"}`,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}

