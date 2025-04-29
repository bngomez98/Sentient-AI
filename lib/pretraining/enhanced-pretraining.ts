import { ENV } from "../env-variables"
import { logger } from "../logger"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

interface Message {
  role: string
  content: string
  [key: string]: any
}

interface PretrainingExample {
  question: string
  answer: string
  domain: string
  complexity: number
}

interface DomainKnowledge {
  domain: string
  concepts: string[]
  facts: string[]
  relationships: string[]
}

interface PretrainingContext {
  relevantExamples: PretrainingExample[]
  domainKnowledge: DomainKnowledge[]
  conceptMapping: Map<string, string[]>
}

/**
 * Enhanced pretraining service for continuous learning and knowledge integration
 */
class EnhancedPretrainingService {
  private enabled: boolean
  private examples: PretrainingExample[]
  private domainKnowledge: Map<string, DomainKnowledge>
  private conceptMapping: Map<string, string[]>
  private keywordToDomain: Map<string, string[]>
  private lastUpdateTime: number

  constructor() {
    this.enabled = ENV.ENABLE_CONTINUOUS_LEARNING === "true"
    this.examples = []
    this.domainKnowledge = new Map()
    this.conceptMapping = new Map()
    this.keywordToDomain = new Map()
    this.lastUpdateTime = 0

    this.initializePretrainingData()

    logger.info("Enhanced Pretraining Service initialized", {
      enabled: this.enabled,
      examplesCount: this.examples.length,
      domainsCount: this.domainKnowledge.size,
    })
  }

  /**
   * Initialize pretraining data from various sources
   */
  private async initializePretrainingData() {
    try {
      // Load examples
      this.examples = this.getMockExamples()

      // Build domain knowledge
      this.buildDomainKnowledge()

      // Build keyword to domain mapping for faster lookup
      this.buildKeywordMapping()

      this.lastUpdateTime = Date.now()
      logger.info("Pretraining data initialized successfully")
    } catch (error) {
      logger.error("Error initializing pretraining data", error)
    }
  }

  /**
   * Build domain knowledge from examples and other sources
   */
  private buildDomainKnowledge() {
    // Group examples by domain
    const domainExamples = new Map<string, PretrainingExample[]>()

    this.examples.forEach((example) => {
      if (!domainExamples.has(example.domain)) {
        domainExamples.set(example.domain, [])
      }
      domainExamples.get(example.domain)!.push(example)
    })

    // Extract concepts, facts, and relationships from examples
    domainExamples.forEach((examples, domain) => {
      const concepts = new Set<string>()
      const facts = new Set<string>()
      const relationships = new Set<string>()

      examples.forEach((example) => {
        // Extract concepts (nouns) from questions and answers
        this.extractConcepts(example.question).forEach((concept) => concepts.add(concept))
        this.extractConcepts(example.answer).forEach((concept) => concepts.add(concept))

        // Extract facts from answers
        this.extractFacts(example.answer).forEach((fact) => facts.add(fact))

        // Extract relationships between concepts
        this.extractRelationships(example.answer).forEach((rel) => relationships.add(rel))
      })

      this.domainKnowledge.set(domain, {
        domain,
        concepts: Array.from(concepts),
        facts: Array.from(facts),
        relationships: Array.from(relationships),
      })
    })

    // Build concept mapping
    this.domainKnowledge.forEach((knowledge) => {
      knowledge.concepts.forEach((concept) => {
        if (!this.conceptMapping.has(concept)) {
          this.conceptMapping.set(concept, [])
        }
        this.conceptMapping.get(concept)!.push(knowledge.domain)
      })
    })
  }

  /**
   * Build keyword to domain mapping for faster lookup
   */
  private buildKeywordMapping() {
    const domainKeywords: Record<string, string[]> = {
      general: ["what", "how", "why", "when", "where", "who", "which", "information", "explain", "describe"],
      technology: [
        "computer",
        "software",
        "hardware",
        "program",
        "code",
        "algorithm",
        "data",
        "internet",
        "web",
        "digital",
        "tech",
        "application",
      ],
      science: [
        "science",
        "scientific",
        "experiment",
        "theory",
        "hypothesis",
        "research",
        "study",
        "discovery",
        "physics",
        "chemistry",
        "biology",
        "astronomy",
      ],
      mathematics: [
        "math",
        "mathematics",
        "calculation",
        "formula",
        "equation",
        "number",
        "geometry",
        "algebra",
        "calculus",
        "statistics",
        "probability",
      ],
      ai: [
        "ai",
        "artificial intelligence",
        "machine learning",
        "neural network",
        "deep learning",
        "nlp",
        "computer vision",
        "model",
        "training",
        "dataset",
        "algorithm",
      ],
      philosophy: [
        "philosophy",
        "ethics",
        "moral",
        "logic",
        "reasoning",
        "existence",
        "consciousness",
        "mind",
        "reality",
        "knowledge",
        "truth",
        "belief",
      ],
      history: [
        "history",
        "historical",
        "past",
        "ancient",
        "medieval",
        "century",
        "era",
        "period",
        "civilization",
        "war",
        "revolution",
        "movement",
      ],
      business: [
        "business",
        "company",
        "corporation",
        "startup",
        "entrepreneur",
        "market",
        "finance",
        "economy",
        "investment",
        "management",
        "strategy",
        "product",
      ],
    }

    // Map keywords to domains
    Object.entries(domainKeywords).forEach(([domain, keywords]) => {
      keywords.forEach((keyword) => {
        if (!this.keywordToDomain.has(keyword)) {
          this.keywordToDomain.set(keyword, [])
        }
        this.keywordToDomain.get(keyword)!.push(domain)
      })
    })
  }

  /**
   * Extract concepts (important nouns) from text
   */
  private extractConcepts(text: string): string[] {
    // Simple extraction of capitalized words and noun phrases
    const words = text.split(/\s+/)
    const concepts = new Set<string>()

    // Extract capitalized words that aren't at the beginning of sentences
    for (let i = 1; i < words.length; i++) {
      const word = words[i].replace(/[.,;:!?]$/, "")
      if (word.length > 1 && word[0] === word[0].toUpperCase() && word[0] !== word[0].toLowerCase()) {
        concepts.add(word.toLowerCase())
      }
    }

    // Extract common noun phrases (simplified)
    const nounPhrasePatterns = [/the ([a-z]+)/gi, /an? ([a-z]+)/gi, /([a-z]+) (of|in|for|with) ([a-z]+)/gi]

    nounPhrasePatterns.forEach((pattern) => {
      const matches = text.matchAll(pattern)
      for (const match of matches) {
        if (match[1] && match[1].length > 3) {
          concepts.add(match[1].toLowerCase())
        }
        if (match[3] && match[3].length > 3) {
          concepts.add(match[3].toLowerCase())
        }
      }
    })

    return Array.from(concepts)
  }

  /**
   * Extract facts from text
   */
  private extractFacts(text: string): string[] {
    // Split text into sentences
    const sentences = text.split(/[.!?]/).filter((s) => s.trim().length > 0)

    // Filter for sentences that are likely to be facts
    const factPatterns = [
      /is a/i,
      /are the/i,
      /consists of/i,
      /refers to/i,
      /defined as/i,
      /means that/i,
      /discovered/i,
      /invented/i,
      /developed/i,
    ]

    return sentences.filter((sentence) => factPatterns.some((pattern) => pattern.test(sentence))).map((s) => s.trim())
  }

  /**
   * Extract relationships between concepts
   */
  private extractRelationships(text: string): string[] {
    // Extract relationships between concepts (simplified)
    const relationshipPatterns = [
      /([a-z]+) (is|are|was|were) ([a-z]+)/gi,
      /([a-z]+) (has|have|had) ([a-z]+)/gi,
      /([a-z]+) (affects|influences|impacts) ([a-z]+)/gi,
      /([a-z]+) (depends on|relies on) ([a-z]+)/gi,
      /([a-z]+) (causes|produces|creates) ([a-z]+)/gi,
    ]

    const relationships = new Set<string>()

    relationshipPatterns.forEach((pattern) => {
      const matches = text.matchAll(pattern)
      for (const match of matches) {
        if (match[1] && match[3] && match[1].length > 3 && match[3].length > 3) {
          relationships.add(`${match[1].toLowerCase()} ${match[2]} ${match[3].toLowerCase()}`)
        }
      }
    })

    return Array.from(relationships)
  }

  /**
   * Get pretraining context for a given query
   */
  async getPretrainingContext(query: string): Promise<PretrainingContext | null> {
    if (!this.enabled) {
      logger.info("Pretraining is disabled")
      return null
    }

    try {
      // Refresh data if needed
      if (Date.now() - this.lastUpdateTime > 24 * 60 * 60 * 1000) {
        // 24 hours
        await this.initializePretrainingData()
      }

      // Identify relevant domains
      const relevantDomains = this.identifyRelevantDomains(query)

      // Get relevant examples
      const relevantExamples = this.getRelevantExamples(query, relevantDomains)

      // Get relevant domain knowledge
      const relevantKnowledge = this.getRelevantDomainKnowledge(relevantDomains)

      logger.info("Generated pretraining context", {
        relevantDomains,
        examplesCount: relevantExamples.length,
        knowledgeCount: relevantKnowledge.length,
      })

      return {
        relevantExamples,
        domainKnowledge: relevantKnowledge,
        conceptMapping: this.conceptMapping,
      }
    } catch (error) {
      logger.error("Error getting pretraining context", error)
      return null
    }
  }

  /**
   * Identify relevant domains for a query
   */
  private identifyRelevantDomains(query: string): string[] {
    const words = query.toLowerCase().split(/\s+/)
    const domainScores = new Map<string, number>()

    // Score domains based on keyword matches
    words.forEach((word) => {
      if (this.keywordToDomain.has(word)) {
        const domains = this.keywordToDomain.get(word)!
        domains.forEach((domain) => {
          domainScores.set(domain, (domainScores.get(domain) || 0) + 1)
        })
      }
    })

    // Extract concepts and check if they map to domains
    const concepts = this.extractConcepts(query)
    concepts.forEach((concept) => {
      if (this.conceptMapping.has(concept)) {
        const domains = this.conceptMapping.get(concept)!
        domains.forEach((domain) => {
          domainScores.set(domain, (domainScores.get(domain) || 0) + 2) // Higher weight for concept matches
        })
      }
    })

    // Sort domains by score
    const sortedDomains = Array.from(domainScores.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([domain]) => domain)

    // Return top domains or "general" if none found
    return sortedDomains.length > 0 ? sortedDomains.slice(0, 3) : ["general"]
  }

  /**
   * Get relevant examples for a query and domains
   */
  private getRelevantExamples(query: string, domains: string[]): PretrainingExample[] {
    // Filter examples by domain
    const domainExamples = this.examples.filter((example) => domains.includes(example.domain))

    // Score examples by relevance to query
    const scoredExamples = domainExamples.map((example) => {
      const score = this.calculateRelevanceScore(query, example)
      return { example, score }
    })

    // Sort by score and take top examples
    return scoredExamples
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(({ example }) => example)
  }

  /**
   * Calculate relevance score between query and example
   */
  private calculateRelevanceScore(query: string, example: PretrainingExample): number {
    const queryWords = new Set(
      query
        .toLowerCase()
        .split(/\s+/)
        .filter((w) => w.length > 3),
    )
    const questionWords = new Set(
      example.question
        .toLowerCase()
        .split(/\s+/)
        .filter((w) => w.length > 3),
    )
    const answerWords = new Set(
      example.answer
        .toLowerCase()
        .split(/\s+/)
        .filter((w) => w.length > 3),
    )

    let score = 0

    // Word overlap
    queryWords.forEach((word) => {
      if (questionWords.has(word)) score += 2
      if (answerWords.has(word)) score += 1
    })

    // Concept overlap
    const queryConcepts = this.extractConcepts(query)
    const exampleConcepts = [...this.extractConcepts(example.question), ...this.extractConcepts(example.answer)]

    queryConcepts.forEach((concept) => {
      if (exampleConcepts.includes(concept)) score += 3
    })

    // Adjust by complexity (prefer simpler examples first)
    score = score * (1 - (example.complexity - 1) / 10)

    return score
  }

  /**
   * Get relevant domain knowledge for given domains
   */
  private getRelevantDomainKnowledge(domains: string[]): DomainKnowledge[] {
    return domains
      .filter((domain) => this.domainKnowledge.has(domain))
      .map((domain) => this.domainKnowledge.get(domain)!)
  }

  /**
   * Enhance reasoning with pretraining knowledge
   */
  async enhanceReasoning(query: string, initialThoughts: string): Promise<string> {
    if (!this.enabled) {
      return initialThoughts
    }

    try {
      const context = await this.getPretrainingContext(query)
      if (!context) return initialThoughts

      // Format context for reasoning enhancement
      const enhancementPrompt = `
Original query: "${query}"

Initial reasoning: "${initialThoughts}"

Relevant domain knowledge:
${context.domainKnowledge
  .map(
    (dk) =>
      `Domain: ${dk.domain}
  Key concepts: ${dk.concepts.slice(0, 10).join(", ")}
  Key facts: ${dk.facts.slice(0, 3).join(" ")}
  `,
  )
  .join("\n")}

Relevant examples:
${context.relevantExamples
  .map(
    (ex, i) =>
      `Example ${i + 1}:
  Q: ${ex.question}
  A: ${ex.answer}
  `,
  )
  .join("\n")}

Based on the above knowledge and examples, enhance the initial reasoning to provide a more comprehensive, accurate, and nuanced analysis of the query. Focus on incorporating relevant concepts, facts, and patterns from the examples.
`

      // Use AI to enhance reasoning
      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt: enhancementPrompt,
        temperature: 0.4,
        maxTokens: 1000,
      })

      logger.info("Enhanced reasoning with pretraining knowledge")
      return text
    } catch (error) {
      logger.error("Error enhancing reasoning with pretraining", error)
      return initialThoughts
    }
  }

  /**
   * Get mock examples for testing
   */
  private getMockExamples(): PretrainingExample[] {
    return [
      // AI Domain
      {
        question: "What is artificial intelligence?",
        answer:
          "Artificial Intelligence (AI) refers to computer systems designed to perform tasks that typically require human intelligence. These include learning, reasoning, problem-solving, perception, and language understanding. Modern AI techniques include machine learning, deep learning, and neural networks, which allow systems to learn from data rather than through explicit programming.",
        domain: "ai",
        complexity: 3,
      },
      {
        question: "How do neural networks work?",
        answer:
          "Neural networks are computational models inspired by the human brain's structure. They consist of interconnected nodes (neurons) organized in layers: an input layer, one or more hidden layers, and an output layer. Each connection has a weight that adjusts during training. Data enters through the input layer, and each neuron applies an activation function to the weighted sum of its inputs. During training, the network adjusts weights through backpropagation to minimize the difference between predicted and actual outputs. This allows neural networks to learn complex patterns and relationships in data.",
        domain: "ai",
        complexity: 7,
      },
      {
        question: "What is the difference between supervised and unsupervised learning?",
        answer:
          "Supervised learning and unsupervised learning differ in how they learn from data. In supervised learning, algorithms are trained on labeled data, where each input has a corresponding output or target value. The algorithm learns to map inputs to outputs, enabling it to predict outputs for new, unseen inputs. Common supervised learning tasks include classification and regression. In contrast, unsupervised learning algorithms work with unlabeled data, identifying patterns, structures, or relationships within the data without predefined outputs. Techniques include clustering, dimensionality reduction, and association. Semi-supervised learning combines both approaches by using a small amount of labeled data with a larger amount of unlabeled data.",
        domain: "ai",
        complexity: 6,
      },
      {
        question: "What is transfer learning in AI?",
        answer:
          "Transfer learning is a machine learning technique where a model developed for one task is reused as the starting point for a model on a second task. Instead of building a model from scratch, transfer learning leverages knowledge gained from solving one problem and applies it to a different but related problem. This approach is particularly valuable when the target task has limited training data. For example, a neural network trained on a large image dataset can be fine-tuned for a specific image classification task with a smaller dataset. Transfer learning significantly reduces training time, improves model performance, and enables effective learning even with limited data.",
        domain: "ai",
        complexity: 8,
      },

      // Science Domain
      {
        question: "What is quantum computing?",
        answer:
          "Quantum computing is a type of computation that harnesses the collective properties of quantum states, such as superposition, interference, and entanglement, to perform calculations. Quantum computers use quantum bits or 'qubits' instead of classical bits. Unlike classical bits which can only be in state 0 or 1, qubits can exist in multiple states simultaneously due to superposition. Additionally, qubits can be entangled, meaning the state of one qubit instantly influences another regardless of distance. These properties allow quantum computers to process vast amounts of information and solve certain problems exponentially faster than classical computers, particularly in areas like cryptography, optimization, and simulation of quantum systems.",
        domain: "science",
        complexity: 9,
      },
      {
        question: "How does photosynthesis work?",
        answer:
          "Photosynthesis is the process by which green plants, algae, and certain bacteria convert light energy, usually from the sun, into chemical energy in the form of glucose or other sugars. The process occurs in two main stages: the light-dependent reactions and the Calvin cycle (light-independent reactions). In the light-dependent reactions, which occur in the thylakoid membrane of chloroplasts, chlorophyll captures energy from sunlight and uses it to produce ATP and NADPH while releasing oxygen as a byproduct. In the Calvin cycle, which takes place in the stroma of chloroplasts, the ATP and NADPH produced in the light-dependent reactions are used to convert carbon dioxide from the atmosphere into glucose. This process is essential for life on Earth as it produces oxygen and serves as the primary source of energy for most ecosystems.",
        domain: "science",
        complexity: 7,
      },

      // Philosophy Domain
      {
        question: "What is existentialism?",
        answer:
          "Existentialism is a philosophical movement that emphasizes individual existence, freedom, and choice. It holds that humans define their own meaning in life, and try to make rational decisions despite existing in an irrational universe. Existentialists believe that individuals are entirely free and must take personal responsibility for themselves, although with this responsibility comes angst, a profound anguish or dread. Key existentialist thinkers include Søren Kierkegaard, Friedrich Nietzsche, Jean-Paul Sartre, and Albert Camus. The philosophy is characterized by concepts such as authenticity, absurdity, and the examination of subjective experience rather than objective truths.",
        domain: "philosophy",
        complexity: 8,
      },

      // Business Domain
      {
        question: "What is a minimum viable product (MVP)?",
        answer:
          "A Minimum Viable Product (MVP) is a development strategy where a new product is initially released with only core features sufficient to satisfy early adopters. The final, complete set of features is only designed and developed after considering feedback from these initial users. This approach helps minimize risks by allowing businesses to test assumptions about market needs before fully investing in a product. MVPs are central to the lean startup methodology, emphasizing iterative product releases, measuring results, and learning from user feedback to guide future development and investment decisions.",
        domain: "business",
        complexity: 5,
      },

      // Technology Domain
      {
        question: "How does blockchain technology work?",
        answer:
          "Blockchain technology is a distributed ledger system that maintains a continuously growing list of records, called blocks, which are linked and secured using cryptography. Each block contains a cryptographic hash of the previous block, a timestamp, and transaction data. Once recorded, the data in any given block cannot be altered retroactively without altering all subsequent blocks, which requires consensus of the network majority. This makes blockchain inherently resistant to modification of data. Blockchains are typically managed by a peer-to-peer network collectively adhering to a protocol for validating new blocks. The decentralized nature eliminates the need for a central authority and creates a transparent, immutable record of transactions. This technology underpins cryptocurrencies like Bitcoin but has applications in many fields including supply chain management, voting systems, and smart contracts.",
        domain: "technology",
        complexity: 8,
      },

      // Mathematics Domain
      {
        question: "What is the Fibonacci sequence?",
        answer:
          "The Fibonacci sequence is a series of numbers where each number is the sum of the two preceding ones, usually starting with 0 and 1. The sequence begins: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, and so on. Mathematically, it can be defined recursively as F(0) = 0, F(1) = 1, and F(n) = F(n-1) + F(n-2) for n > 1. The sequence is named after Italian mathematician Leonardo of Pisa, known as Fibonacci, who introduced it to Western mathematics in his 1202 book 'Liber Abaci.' The Fibonacci sequence appears in many settings in mathematics and nature, such as the arrangement of leaves on stems, the spiral of shells, and the family tree of honeybees. The ratio of consecutive Fibonacci numbers approaches the golden ratio (approximately 1.618), which has been used in art and architecture for its aesthetic properties.",
        domain: "mathematics",
        complexity: 6,
      },

      // History Domain
      {
        question: "What caused World War I?",
        answer:
          "World War I (1914-1918) was triggered by the assassination of Archduke Franz Ferdinand of Austria-Hungary in June 1914, but its underlying causes were complex and interconnected. Key factors included: militarism and the arms race between European powers; a complex web of alliances (Triple Alliance and Triple Entente) that divided Europe into opposing camps; imperial competition for colonies and resources; nationalism and ethnic tensions, particularly in the Balkans; and domestic political pressures within various countries. The assassination in Sarajevo set off a chain reaction due to these underlying tensions, as Austria-Hungary declared war on Serbia, Russia mobilized to defend Serbia, Germany honored its alliance with Austria-Hungary, and other nations were drawn in through their alliance commitments, ultimately engulfing much of the world in conflict.",
        domain: "history",
        complexity: 7,
      },

      // General Domain
      {
        question: "How does the internet work?",
        answer:
          "The Internet works through a global network of interconnected computers that communicate using standardized protocols, primarily TCP/IP (Transmission Control Protocol/Internet Protocol). When you access a website, your device sends a request through your Internet Service Provider (ISP) to the server hosting the site. Data is broken into packets, routed through multiple networks via routers and switches, and reassembled at the destination. DNS (Domain Name System) servers translate human-readable domain names (like example.com) into IP addresses, allowing your browser to connect to the correct server. The HTTP or HTTPS protocol then facilitates the transfer of web content. This entire process—from request to display—typically happens in seconds, creating the seamless browsing experience we're accustomed to. The Internet's distributed architecture, with no central control point, makes it highly resilient and allows for its continued growth and evolution.",
        domain: "general",
        complexity: 5,
      },
    ]
  }
}

// Export singleton instance
export const enhancedPretraining = new EnhancedPretrainingService()
