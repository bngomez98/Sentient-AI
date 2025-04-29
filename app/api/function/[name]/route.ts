import { logger } from "@/lib/logger"

export async function POST(req: Request, { params }: { params: { name: string } }) {
  try {
    const { name } = params
    const args = await req.json()

    logger.info(`Function call: ${name}`, args)

    // Handle different functions
    switch (name) {
      case "search":
        return handleSearch(args.query)
      case "calculate":
        return handleCalculate(args.expression)
      default:
        return new Response(
          JSON.stringify({
            error: `Function ${name} not found`,
          }),
          { status: 404, headers: { "Content-Type": "application/json" } },
        )
    }
  } catch (error) {
    logger.error("Error in function API route", error instanceof Error ? error.message : String(error))

    return new Response(
      JSON.stringify({
        error: "Error processing function call",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }
}

async function handleSearch(query: string) {
  try {
    // In a real application, you would implement an actual search here
    // For now, we'll just return a mock response
    const result = `Here are the search results for "${query}":
    
1. First relevant result about ${query}
2. Second relevant result about ${query}
3. Third relevant result about ${query}`

    return new Response(
      JSON.stringify({
        result,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    )
  } catch (error) {
    logger.error("Error in search function", error)
    throw error
  }
}

async function handleCalculate(expression: string) {
  try {
    // Safely evaluate the expression
    let result
    try {
      // Use Function constructor to safely evaluate the expression
      // This is safer than eval() but still needs caution
      result = new Function(`return ${expression}`)()
    } catch (error) {
      result = `Error evaluating expression: ${error instanceof Error ? error.message : "Unknown error"}`
    }

    return new Response(
      JSON.stringify({
        result: `${expression} = ${result}`,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    )
  } catch (error) {
    logger.error("Error in calculate function", error)
    throw error
  }
}
