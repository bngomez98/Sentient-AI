import { logger } from "@/lib/logger"
import { processWithReasoning } from "@/lib/reasoning"
import { enhanceWithPretraining } from "@/lib/pretraining"
import { dialogueVAEService } from "@/lib/dialogue-vae"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export const runtime = "nodejs"

// Use the PPLX API key directly
const PPLX_API_KEY = "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"

export async function POST(req: Request) {
  try {
    // Parse the request body
    const { messages, systemPrompt = "", temperature = 0.2 } = await req.json()

    // Validate messages
    if (!Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Invalid messages format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Get the last user message for preprocessing
    const lastUserMessage = messages.filter((m) => m.role === "user").pop() || {}
    const lastUserContent = lastUserMessage.content || ""
    const lastUserFiles = lastUserMessage.files || []

    // Process with reasoning
    const reasoningSteps = await processWithReasoning(lastUserContent, messages)
    logger.info("Reasoning steps completed", { steps: reasoningSteps.length })

    // Enhance with pretraining examples
    const enhancedMessages = await enhanceWithPretraining(messages, lastUserContent)
    logger.info("Pretraining enhancement completed", {
      originalCount: messages.length,
      enhancedCount: enhancedMessages.length,
    })

    // Extract contextual signal using VAE
    let contextualSignal = null
    try {
      // Use the VAE service endpoint from environment variable
      contextualSignal = await dialogueVAEService.extractContextualSignal(lastUserContent)
      logger.info("Contextual signal extracted", {
        shape: contextualSignal?.shape,
        available: !!contextualSignal,
      })
    } catch (error) {
      logger.error("Error extracting contextual signal", error)
      // Continue without contextual signal
    }

    // Process file content if files are present
    let fileContent = ""
    let fileAnalysis = ""

    if (lastUserFiles && lastUserFiles.length > 0) {
      logger.info(`Processing ${lastUserFiles.length} files from user message`)

      // Combine file content
      fileContent = lastUserFiles
        .map((file) => {
          return `--- File: ${file.name} (${file.type}) ---\n${file.content}\n\n`
        })
        .join("\n")

      // Generate analysis of file content using OpenAI
      try {
        const { text } = await generateText({
          model: openai("gpt-4o"),
          prompt: `Analyze the following file content and provide a brief summary:
          
          ${fileContent.substring(0, 5000)}${fileContent.length > 5000 ? "..." : ""}`,
        })

        fileAnalysis = text
        logger.info("Generated file analysis", { analysisLength: fileAnalysis.length })
      } catch (error) {
        logger.error("Error generating file analysis", error)
        fileAnalysis = "Error analyzing file content."
      }
    }

    // Prepare system message with reasoning context, contextual signal, and file analysis
    const reasoningContext = reasoningSteps.map((step) => `${step.description}: ${step.result}`).join("\n")

    // Add contextual signal information if available with more detailed analysis
    const contextualInfo = contextualSignal
      ? `
Contextual analysis indicates this query has the following characteristics:
- Complexity: ${Math.round(contextualSignal.vector[0] * 10)}/10
- Question type: ${contextualSignal.vector[2] > 0.5 ? "Information seeking" : "Statement or request"}
- Emotional intensity: ${Math.round(contextualSignal.vector[3] * 10)}/10
- Technical content: ${Math.round(contextualSignal.vector[7] * 10)}/10
- Length: ${Math.round(contextualSignal.vector[4] * 100)} words (normalized)
- Sentence structure: ${contextualSignal.vector[6] > 0.5 ? "Complex" : "Simple"}`
      : ""

    // Add file analysis if available
    const fileInfo = fileContent
      ? `
The user has uploaded ${lastUserFiles.length} file(s). Here's a summary of the file content:
${fileAnalysis}

You should reference this information in your response when relevant.`
      : ""

    const enhancedSystemPrompt = `
You are Sentient-1, an advanced neural-symbolic AI assistant with contextual understanding and reasoning capabilities.
Be precise, concise, and helpful. You can process and analyze various file types including PDFs, images, audio, video, and documents.

I've analyzed this query with the following reasoning:
${reasoningContext}
${contextualInfo}
${fileInfo}

Based on this analysis, provide a well-structured, accurate response.
`.trim()

    // Prepare API request body exactly as specified
    const apiRequestBody = {
      model: "sonar-small-chat", // Updated to a valid model name
      messages: [{ role: "system", content: enhancedSystemPrompt }, ...enhancedMessages],
      max_tokens: 1000,
      temperature: temperature,
      top_p: 0.9,
      top_k: 0,
      stream: false,
      presence_penalty: 0,
      frequency_penalty: 1,
    }

    // Use Perplexity API with the direct API key
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PPLX_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    })

    if (!response.ok) {
      const errorText = await response.text()
      logger.error("Perplexity API error", { status: response.status, error: errorText })
      throw new Error(`Perplexity API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()

    // Log the successful response
    logger.info("Successful API response", {
      model: "sonar-small-chat",
      messageCount: enhancedMessages.length,
      responseLength: data.choices[0].message.content.length,
      pretrainingUsed: enhancedMessages.length > messages.length,
      contextualSignalUsed: !!contextualSignal,
      filesProcessed: lastUserFiles.length,
    })

    return new Response(
      JSON.stringify({
        content: data.choices[0].message.content,
        role: "assistant",
        reasoning: reasoningSteps,
        contextualSignal: contextualSignal
          ? {
              available: true,
              dimensions: contextualSignal.shape[1],
            }
          : null,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    )
  } catch (error) {
    logger.error("Error in chat API route", error)

    // Return a graceful error response
    return new Response(
      JSON.stringify({
        error: "Something went wrong processing your request. Please try again.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }
}

