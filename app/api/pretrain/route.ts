import { type NextRequest, NextResponse } from "next/server"
import { logger } from "@/lib/logger"
import { ENV } from "@/lib/env-variables"

interface PretrainRequest {
  query: string
  domains?: string[]
  maxExamples?: number
}

interface PretrainResponse {
  examples: Array<{
    input: string
    output: string
    similarity: number
    source: string
  }>
  domains: string[]
  processingTime: number
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const startTime = performance.now()

    // Parse request body
    const body: PretrainRequest = await request.json()

    if (!body.query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    // Default values
    const domains = body.domains || ["general"]
    const maxExamples = body.maxExamples || 5

    logger.info("Processing pretrain request", {
      query: body.query.substring(0, 50),
      domains,
      maxExamples,
    })

    // Check if Hugging Face token is available
    if (!ENV.HUGGINGFACE_API_TOKEN) {
      logger.warn("Hugging Face token not available, using fallback examples")
      const fallbackResponse = generateFallbackExamples(body.query, domains, maxExamples)

      const endTime = performance.now()
      fallbackResponse.processingTime = Math.round(endTime - startTime)

      return NextResponse.json(fallbackResponse)
    }

    // Fetch examples from Hugging Face datasets
    const examples = await fetchExamplesFromHuggingFace(body.query, domains, maxExamples)

    const endTime = performance.now()
    const processingTime = Math.round(endTime - startTime)

    const response: PretrainResponse = {
      examples,
      domains,
      processingTime,
    }

    return NextResponse.json(response)
  } catch (error) {
    logger.error("Error in pretrain API route", error)

    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

/**
 * Fetch examples from Hugging Face datasets
 */
async function fetchExamplesFromHuggingFace(
  query: string,
  domains: string[],
  maxExamples: number,
): Promise<PretrainResponse["examples"]> {
  try {
    // Map domains to dataset IDs
    const datasetMap: Record<string, string[]> = {
      general: ["squad", "glue"],
      science: ["sciq", "ai2_arc"],
      coding: ["code_search_net", "codeparrot"],
      math: ["math_qa", "gsm8k"],
      reasoning: ["hellaswag", "winogrande"],
    }

    // Get relevant datasets
    const relevantDatasets: string[] = []
    domains.forEach((domain) => {
      const datasets = datasetMap[domain] || datasetMap["general"]
      relevantDatasets.push(...datasets)
    })

    // Deduplicate datasets
    const uniqueDatasets = [...new Set(relevantDatasets)]

    // Prepare the request to Hugging Face Inference API
    const response = await fetch("https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ENV.HUGGINGFACE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: {
          source_sentence: query,
          sentences: [
            "What is machine learning?",
            "How do neural networks work?",
            "Explain the concept of backpropagation",
            "What is the difference between supervised and unsupervised learning?",
            "How does gradient descent optimize neural networks?",
          ],
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.status}`)
    }

    const data = await response.json()

    // Process the similarity scores
    // In a real implementation, we would use these scores to retrieve relevant examples
    // from the datasets. Here we'll simulate that with predefined examples.

    return generateSimulatedExamples(query, uniqueDatasets, maxExamples, data)
  } catch (error) {
    logger.error("Error fetching examples from Hugging Face", error)
    return generateFallbackExamples(query, domains, maxExamples).examples
  }
}

/**
 * Generate simulated examples based on similarity scores
 */
function generateSimulatedExamples(
  query: string,
  datasets: string[],
  maxExamples: number,
  similarityData: any,
): PretrainResponse["examples"] {
  // Extract similarity scores
  const similarities = Array.isArray(similarityData) ? similarityData : [0.5, 0.6, 0.7, 0.8, 0.9]

  // Predefined examples for different topics
  const examplesByTopic: Record<string, Array<{ input: string; output: string }>> = {
    machine_learning: [
      {
        input: "What is machine learning?",
        output:
          "Machine learning is a subset of artificial intelligence that focuses on developing algorithms and statistical models that enable computers to perform tasks without explicit instructions, relying instead on patterns and inference.",
      },
      {
        input: "How do neural networks work?",
        output:
          "Neural networks are computing systems inspired by biological neural networks. They consist of layers of interconnected nodes or 'neurons' that process information. Each connection has a weight that adjusts as learning proceeds, allowing the network to learn patterns in data.",
      },
      {
        input: "Explain the concept of backpropagation",
        output:
          "Backpropagation is a method used to train neural networks by calculating gradients of the loss function with respect to the weights. It works by propagating the error backward through the network, adjusting weights to minimize the loss function.",
      },
    ],
    programming: [
      {
        input: "What is object-oriented programming?",
        output:
          "Object-oriented programming (OOP) is a programming paradigm based on the concept of 'objects', which can contain data and code. The data is in the form of fields (attributes), and the code is in the form of procedures (methods).",
      },
      {
        input: "Explain recursion in programming",
        output:
          "Recursion is a programming technique where a function calls itself to solve smaller instances of the same problem. It requires a base case to prevent infinite recursion and is often used for problems that can be  It requires a base case to prevent infinite recursion and is often used for problems that can be broken down into smaller, similar subproblems.",
      },
      {
        input: "What is the difference between compiled and interpreted languages?",
        output:
          "Compiled languages convert code to machine code before execution, resulting in faster performance but platform-specific executables. Interpreted languages execute code line-by-line at runtime, offering greater flexibility and platform independence but typically slower execution.",
      },
    ],
    mathematics: [
      {
        input: "Explain the concept of calculus",
        output:
          "Calculus is a branch of mathematics focused on the study of continuous change. It has two major branches: differential calculus (concerning rates of change and slopes of curves) and integral calculus (concerning accumulation of quantities and areas under curves).",
      },
      {
        input: "What is linear algebra?",
        output:
          "Linear algebra is the branch of mathematics concerning linear equations, linear functions, and their representations through matrices and vector spaces. It's fundamental to many fields including physics, engineering, and machine learning.",
      },
    ],
  }

  // Determine which topic is most relevant to the query
  let relevantTopic = "machine_learning"
  if (query.toLowerCase().includes("program") || query.toLowerCase().includes("code")) {
    relevantTopic = "programming"
  } else if (query.toLowerCase().includes("math") || query.toLowerCase().includes("calculus")) {
    relevantTopic = "mathematics"
  }

  // Get examples for the relevant topic
  const topicExamples = examplesByTopic[relevantTopic] || examplesByTopic["machine_learning"]

  // Create examples with similarity scores
  const examples = topicExamples.slice(0, maxExamples).map((example, index) => {
    // Use real similarity scores if available, otherwise simulate
    const similarity = similarities[index] || 0.9 - index * 0.1

    return {
      input: example.input,
      output: example.output,
      similarity: Number.parseFloat(similarity.toFixed(2)),
      source: datasets[index % datasets.length] || "general-dataset",
    }
  })

  return examples
}

/**
 * Generate fallback examples when Hugging Face API is not available
 */
function generateFallbackExamples(query: string, domains: string[], maxExamples: number): PretrainResponse {
  // Simple keyword matching for domain detection
  const keywordToDomain: Record<string, string> = {
    machine: "machine_learning",
    learning: "machine_learning",
    neural: "machine_learning",
    ai: "machine_learning",
    code: "programming",
    program: "programming",
    function: "programming",
    math: "mathematics",
    equation: "mathematics",
    calculus: "mathematics",
  }

  // Determine domain based on query keywords
  let detectedDomain = "general"
  const queryLower = query.toLowerCase()

  for (const [keyword, domain] of Object.entries(keywordToDomain)) {
    if (queryLower.includes(keyword)) {
      detectedDomain = domain
      break
    }
  }

  // Basic examples for different domains
  const domainExamples: Record<string, Array<{ input: string; output: string }>> = {
    general: [
      {
        input: "What is the capital of France?",
        output: "The capital of France is Paris.",
      },
      {
        input: "Who wrote Romeo and Juliet?",
        output: "William Shakespeare wrote Romeo and Juliet.",
      },
    ],
    machine_learning: [
      {
        input: "What is supervised learning?",
        output:
          "Supervised learning is a type of machine learning where the algorithm learns from labeled training data to make predictions or decisions.",
      },
      {
        input: "Explain what a neural network is",
        output:
          "A neural network is a computational model inspired by the human brain that consists of layers of interconnected nodes or 'neurons' that process information and learn patterns in data.",
      },
    ],
    programming: [
      {
        input: "What is a variable in programming?",
        output:
          "A variable in programming is a named storage location that contains data which can be modified during program execution.",
      },
      {
        input: "Explain what a function is in programming",
        output:
          "A function in programming is a reusable block of code designed to perform a specific task. It takes inputs (parameters), processes them, and returns a result.",
      },
    ],
    mathematics: [
      {
        input: "What is the Pythagorean theorem?",
        output:
          "The Pythagorean theorem states that in a right triangle, the square of the length of the hypotenuse equals the sum of the squares of the lengths of the other two sides: a² + b² = c².",
      },
      {
        input: "Explain what a derivative is in calculus",
        output:
          "A derivative in calculus represents the rate of change of a function with respect to one of its variables. It measures how a function changes as its input changes.",
      },
    ],
  }

  // Get examples for the detected domain
  const relevantExamples = domainExamples[detectedDomain] || domainExamples["general"]

  // Create examples with simulated similarity scores
  const examples = relevantExamples.slice(0, maxExamples).map((example, index) => {
    return {
      input: example.input,
      output: example.output,
      similarity: 0.9 - index * 0.1,
      source: "fallback-dataset",
    }
  })

  return {
    examples,
    domains: [detectedDomain],
    processingTime: 0,
  }
}

