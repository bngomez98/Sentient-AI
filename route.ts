import { type NextRequest, NextResponse } from "next/server"

// Enhanced logging function
function log(level: "info" | "error" | "warn", message: string, data?: any) {
  const timestamp = new Date().toISOString()
  console[level](`[${timestamp}] [${level.toUpperCase()}] ${message}`, data || "")
}

// Dataset URLs for Hugging Face
const DATASET_URLS = {
  natural_reasoning:
    "https://datasets-server.huggingface.co/rows?dataset=facebook%2Fnatural_reasoning&config=default&split=train&offset={offset}&length={length}",
  deepseek_chinese:
    "https://datasets-server.huggingface.co/rows?dataset=Congliu%2FChinese-DeepSeek-R1-Distill-data-110k&config=default&split=train&offset={offset}&length={length}",
  openr1_math:
    "https://datasets-server.huggingface.co/rows?dataset=open-r1%2FOpenR1-Math-220k&config=default&split=train&offset={offset}&length={length}",
}

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body = await req.json()
    const { query, count = 5 } = body

    if (!query) {
      return NextResponse.json({ error: "No query provided for pretraining" }, { status: 400 })
    }

    log("info", `Pretraining request for query: ${query}`)

    // Determine which dataset to use based on the query
    const lowerQuery = query.toLowerCase()
    let dataset = "natural_reasoning"

    if (
      lowerQuery.includes("math") ||
      lowerQuery.includes("calculus") ||
      lowerQuery.includes("equation") ||
      lowerQuery.includes("solve")
    ) {
      dataset = "openr1_math"
    } else if (lowerQuery.includes("chinese") || lowerQuery.includes("translate") || lowerQuery.includes("mandarin")) {
      dataset = "deepseek_chinese"
    }

    log("info", `Selected dataset for pretraining: ${dataset}`)

    // Fetch samples from the selected dataset
    try {
      const offset = Math.floor(Math.random() * 100) // Random offset for variety
      const url = DATASET_URLS[dataset as keyof typeof DATASET_URLS]
        .replace("{offset}", offset.toString())
        .replace("{length}", count.toString())

      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error(`Hugging Face API returned ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (!data.rows || !Array.isArray(data.rows)) {
        throw new Error("Invalid response format from Hugging Face API")
      }

      log("info", `Successfully fetched ${data.rows.length} pretraining samples from ${dataset}`)

      // Format the samples for pretraining
      const pretrainingSamples = data.rows
        .map((sample: any) => {
          if (dataset === "natural_reasoning") {
            return {
              question: sample.row?.question || "",
              answer: sample.row?.answer || "",
            }
          } else if (dataset === "deepseek_chinese") {
            return {
              question: sample.row?.instruction || "",
              answer: sample.row?.output || "",
            }
          } else {
            // openr1_math
            return {
              question: sample.row?.question || "",
              answer: sample.row?.answer || "",
            }
          }
        })
        .filter((sample: any) => sample.question && sample.answer)

      return NextResponse.json({
        dataset,
        samples: pretrainingSamples,
      })
    } catch (error) {
      log("error", "Error fetching pretraining samples", error)

      // Return empty samples on error
      return NextResponse.json({
        dataset,
        samples: [],
        error: (error as Error).message,
      })
    }
  } catch (error) {
    log("error", "General error in pretrain API", error)
    return NextResponse.json({ error: `Error in pretrain API: ${(error as Error).message}` }, { status: 500 })
  }
}

