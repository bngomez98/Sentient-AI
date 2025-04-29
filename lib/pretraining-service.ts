import { logger } from "./logger"
import { ENV } from "./env-variables"

interface Message {
  role: string
  content: string
  [key: string]: any
}

interface Example {
  question: string
  answer: string
}

interface Dataset {
  id: string
  name: string
  huggingfaceId: string
  description: string
  domains: string[]
}

// Cache for examples to avoid repeated API calls
const exampleCache = new Map<string, Example[]>()

// Available datasets
const datasets: Dataset[] = [
  {
    id: "general-qa",
    name: "General Q&A",
    huggingfaceId: "squad",
    description: "General question answering dataset",
    domains: ["general", "knowledge", "information"],
  },
  {
    id: "programming",
    name: "Programming Q&A",
    huggingfaceId: "code_x_glue_ct_code_to_text",
    description: "Programming and code-related questions",
    domains: ["programming", "coding", "software", "development", "computer"],
  },
  {
    id: "science",
    name: "Science Q&A",
    huggingfaceId: "sciq",
    description: "Scientific questions and explanations",
    domains: ["science", "physics", "chemistry", "biology", "scientific"],
  },
  {
    id: "ai-ml",
    name: "AI and Machine Learning",
    huggingfaceId: "ai2_arc",
    description: "AI and machine learning concepts",
    domains: ["ai", "artificial intelligence", "machine learning", "neural", "deep learning"],
  },
]

/**
 * Enhance messages with pretraining examples
 */
export async function enhanceWithPretraining(messages: Message[], query: string): Promise<Message[]> {
  try {
    logger.info("Enhancing with pretraining", { query: query.substring(0, 50) })

    // Skip if continuous learning is disabled
    if (!ENV.ENABLE_CONTINUOUS_LEARNING) {
      logger.info("Continuous learning disabled, skipping pretraining")
      return messages
    }

    // Find relevant datasets based on the query
    const relevantDatasets = findRelevantDatasets(query)
    logger.info("Found relevant datasets", {
      datasets: relevantDatasets.map((d) => d.id),
    })

    if (relevantDatasets.length === 0) {
      return messages
    }

    // Get examples from Hugging Face for each relevant dataset
    const allExamples: Example[] = []

    for (const dataset of relevantDatasets) {
      const examples = await getExamplesFromHuggingFace(dataset, query)
      allExamples.push(...examples)
    }

    if (allExamples.length === 0) {
      return messages
    }

    // Convert examples to system messages
    const exampleMessages = allExamples.map((example) => ({
      role: "system",
      content: `For questions like "${example.question}", respond with: "${example.answer}"`,
    }))

    // Insert examples after any existing system messages
    const systemMessages = messages.filter((m) => m.role === "system")
    const nonSystemMessages = messages.filter((m) => m.role !== "system")

    return [...systemMessages, ...exampleMessages, ...nonSystemMessages]
  } catch (error) {
    logger.error("Error enhancing with pretraining", error)
    return messages
  }
}

/**
 * Find datasets relevant to the query
 */
function findRelevantDatasets(query: string): Dataset[] {
  const queryLower = query.toLowerCase()
  const scoredDatasets = datasets.map((dataset) => {
    let score = 0

    // Check for domain matches
    dataset.domains.forEach((domain) => {
      if (queryLower.includes(domain)) {
        score += 2
      }
    })

    // Check for dataset name match
    if (queryLower.includes(dataset.name.toLowerCase())) {
      score += 3
    }

    // Always give some score to general-qa
    if (dataset.id === "general-qa") {
      score = Math.max(score, 1)
    }

    return { dataset, score }
  })

  // Sort by score and take top 2
  return scoredDatasets
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .filter((item) => item.score > 0)
    .map((item) => item.dataset)
}

/**
 * Get examples from Hugging Face for a dataset
 */
async function getExamplesFromHuggingFace(dataset: Dataset, query: string): Promise<Example[]> {
  try {
    // Check cache first
    const cacheKey = `${dataset.id}:${query.substring(0, 20)}`
    if (exampleCache.has(cacheKey)) {
      return exampleCache.get(cacheKey) || []
    }

    logger.info(`Fetching examples from Hugging Face for dataset ${dataset.id}`)

    // Call Hugging Face API
    const response = await fetch(`https://api-inference.huggingface.co/models/${dataset.huggingfaceId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ENV.HUGGINGFACE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: {
          question: query,
          context: "This is a request for relevant examples.",
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.status}`)
    }

    const data = await response.json()

    // Process the response into examples
    let examples: Example[] = []

    if (Array.isArray(data)) {
      // Handle array response
      examples = data.slice(0, 3).map((item) => ({
        question: item.question || query,
        answer: item.answer || item.text || "No specific answer available.",
      }))
    } else if (data.answers && Array.isArray(data.answers)) {
      // Handle SQuAD-like format
      examples = [
        {
          question: data.question || query,
          answer: data.answers[0].text || "No specific answer available.",
        },
      ]
    } else if (typeof data === "object") {
      // Handle generic object response
      examples = [
        {
          question: query,
          answer: JSON.stringify(data).substring(0, 500),
        },
      ]
    }

    // If we couldn't extract meaningful examples, fall back to mock examples
    if (examples.length === 0) {
      examples = getMockExamples(dataset.id, query)
    }

    // Cache the results
    exampleCache.set(cacheKey, examples)

    return examples
  } catch (error) {
    logger.error(`Error fetching from Hugging Face for ${dataset.id}`, error)
    // Fall back to mock examples
    return getMockExamples(dataset.id, query)
  }
}

/**
 * Get mock examples for a dataset
 */
function getMockExamples(datasetId: string, query: string): Example[] {
  // Mock examples for different datasets
  const mockExamples: Record<string, Example[]> = {
    "general-qa": [
      {
        question: "What is artificial intelligence?",
        answer:
          "Artificial Intelligence (AI) refers to computer systems designed to perform tasks that typically require human intelligence, such as visual perception, speech recognition, decision-making, and language translation. Modern AI often uses machine learning techniques where algorithms learn patterns from data rather than following explicitly programmed instructions.",
      },
      {
        question: "How does the internet work?",
        answer:
          "The Internet works through a global network of interconnected computers that communicate using standardized protocols, primarily TCP/IP. When you access a website, your device sends a request through your Internet Service Provider to the server hosting the site. Data is broken into packets, routed through multiple networks, and reassembled at the destination. DNS servers translate domain names into IP addresses, allowing your browser to connect to the correct server.",
      },
    ],
    programming: [
      {
        question: "What is a RESTful API?",
        answer:
          "A RESTful API (Representational State Transfer) is an architectural style for designing networked applications. It relies on stateless, client-server communication, typically over HTTP, using operations like GET, POST, PUT, and DELETE. RESTful APIs treat server objects as resources that can be created, read, updated, or deleted. They're characterized by a uniform interface, statelessness, cacheability, and a layered system architecture.",
      },
      {
        question: "How do JavaScript promises work?",
        answer:
          "JavaScript Promises are objects representing the eventual completion or failure of an asynchronous operation and its resulting value. A Promise is in one of three states: pending (initial state), fulfilled (operation completed successfully), or rejected (operation failed). Promises are created using the Promise constructor which takes an executor function with resolve and reject parameters. The .then() method is used to handle fulfillment, .catch() handles rejections, and .finally() executes regardless of outcome. Promises can be chained and combined using Promise.all(), Promise.race(), and other methods.",
      },
    ],
    science: [
      {
        question: "How does quantum computing work?",
        answer:
          "Quantum computing works by using quantum bits or 'qubits' instead of classical bits. Unlike classical bits which can only be in state 0 or 1, qubits can exist in multiple states simultaneously due to superposition. Additionally, qubits can be entangled, meaning the state of one qubit instantly influences another regardless of distance. These properties allow quantum computers to process vast amounts of information and solve certain problems exponentially faster than classical computers. Quantum algorithms like Shor's and Grover's algorithms exploit these quantum mechanical phenomena for computational advantage.",
      },
      {
        question: "What is the theory of relativity?",
        answer:
          "The Theory of Relativity, developed by Albert Einstein, consists of two theories: Special Relativity (1905) and General Relativity (1915). Special Relativity states that the laws of physics are the same for all non-accelerating observers, and the speed of light is constant regardless of the observer's motion. It introduces the concept that space and time are interwoven into a single continuum known as spacetime, and that energy and mass are equivalent (E=mc²). General Relativity extends these concepts to include gravity, describing it not as a force but as a curvature of spacetime caused by mass and energy.",
      },
    ],
    "ai-ml": [
      {
        question: "What is the difference between supervised and unsupervised learning?",
        answer:
          "Supervised learning and unsupervised learning are two fundamental approaches in machine learning that differ in how they learn from data. In supervised learning, algorithms are trained on labeled data, where each input has a corresponding output or target value. The algorithm learns to map inputs to outputs, enabling it to predict outputs for new, unseen inputs. Common supervised learning tasks include classification and regression. In contrast, unsupervised learning algorithms work with unlabeled data, identifying patterns, structures, or relationships within the data without predefined outputs. Techniques include clustering, dimensionality reduction, and association. Semi-supervised learning combines both approaches by using a small amount of labeled data with a larger amount of unlabeled data.",
      },
      {
        question: "How do neural networks work?",
        answer:
          "Neural networks are computational models inspired by the human brain's structure and function. They consist of interconnected nodes (neurons) organized in layers: an input layer, one or more hidden layers, and an output layer. Each connection between neurons has a weight that adjusts during training. When data enters through the input layer, each neuron applies an activation function to the weighted sum of its inputs, producing an output that's passed to the next layer. During training, the network adjusts weights through backpropagation, minimizing the difference between predicted and actual outputs. Deep neural networks with many hidden layers can learn hierarchical representations, with earlier layers detecting simple features and deeper layers combining these into more complex patterns, enabling the modeling of highly complex relationships in data.",
      },
    ],
  }

  // Get examples for the dataset
  const examples = mockExamples[datasetId] || mockExamples["general-qa"]

  // Filter for relevance to the query if possible
  const queryWords = query
    .toLowerCase()
    .split(/\W+/)
    .filter((w) => w.length > 3)

  if (queryWords.length > 0) {
    // Score examples by relevance
    const scoredExamples = examples.map((example) => {
      const questionWords = example.question
        .toLowerCase()
        .split(/\W+/)
        .filter((w) => w.length > 3)
      let score = 0

      queryWords.forEach((word) => {
        if (questionWords.includes(word)) score += 1
      })

      return { example, score }
    })

    // Return most relevant examples
    return scoredExamples
      .sort((a, b) => b.score - a.score)
      .slice(0, 2)
      .map((item) => item.example)
  }

  // If no relevant examples, return the first two\
  return examples.slice(  => item.example)
}

// If no relevant examples, return the first two
return examples.slice(0, 2)
}

/**
 * Update the logger to use our environment variables
 */
```typescript file="lib/logger.ts"
// Environment variables with default values from ENV
import { ENV } from "./env-variables"

// Simple logger implementation with configurable log level
export const logger = {
  debug: (message: string, data?: any) => {
    if (ENV.ENABLE_LOGGING && isLevelEnabled("debug")) {
      console.debug(`[DEBUG] ${formatMessage(message, data)}`)
    }
  },

  info: (message: string, data?: any) => {
    if (ENV.ENABLE_LOGGING && isLevelEnabled("info")) {
      console.log(`[INFO] ${formatMessage(message, data)}`)
    }
  },

  warn: (message: string, data?: any) => {
    if (ENV.ENABLE_LOGGING && isLevelEnabled("warn")) {
      console.warn(`[WARN] ${formatMessage(message, data)}`)
    }
  },

  error: (message: string, data?: any) => {
    if (ENV.ENABLE_LOGGING && isLevelEnabled("error")) {
      console.error(`[ERROR] ${formatMessage(message, data)}`)
    }
  },
}

// Format message with optional data
function formatMessage(message: string, data?: any): string {
  if (!data) return message

  try {
    // Handle Error objects specially
    if (data instanceof Error) {
      return `${message} - ${data.message}`
    }

    // Convert objects to string representation
    const dataString = typeof data === "object" ? JSON.stringify(data, null, 2) : String(data)

    return `${message} ${dataString}`
  } catch (err) {
    return `${message} [Unserializable data]`
  }
}

// Check if the current log level enables the specified level
function isLevelEnabled(level: string): boolean {
  const levels = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  }

  const currentLevel = levels[ENV.LOG_LEVEL as keyof typeof levels] || 1
  const requestedLevel = levels[level as keyof typeof levels] || 0

  return requestedLevel >= currentLevel
}
