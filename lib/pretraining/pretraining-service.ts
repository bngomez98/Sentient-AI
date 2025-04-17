import { ENV } from "../env-variables"
import { logger } from "../logger"

interface Message {
  role: string
  content: string
  [key: string]: any
}

interface PretrainingExample {
  question: string
  answer: string
}

interface DatasetInfo {
  id: string
  name: string
  description: string
  domain: string[]
  complexity: number
}

/**
 * Advanced pretraining service for continuous learning
 */
class PretrainingService {
  private enabled: boolean
  private datasets: DatasetInfo[]
  private exampleCache: Map<string, PretrainingExample[]>
  private huggingfaceToken: string

  constructor() {
    this.enabled = ENV.ENABLE_CONTINUOUS_LEARNING
    this.exampleCache = new Map()
    this.datasets = this.initializeDatasets()
    this.huggingfaceToken = ENV.HUGGINGFACE_API_TOKEN

    logger.info("Pretraining Service initialized", {
      enabled: this.enabled,
      datasetCount: this.datasets.length,
      hasHuggingFace: !!this.huggingfaceToken,
    })
  }

  /**
   * Enhance conversation with pretraining examples
   */
  async enhanceWithPretraining(messages: Message[], lastUserMessage: string): Promise<Message[]> {
    try {
      // Skip enhancement if continuous learning is disabled
      if (!this.enabled) {
        logger.info("Pretraining enhancement skipped (continuous learning disabled)")
        return messages
      }

      if (!lastUserMessage || lastUserMessage.trim().length === 0) {
        return messages
      }

      // Determine the datasets to use
      const relevantDatasets = this.selectRelevantDatasets(lastUserMessage)
      logger.info("Selected relevant datasets", {
        datasets: relevantDatasets.map((d) => d.id),
      })

      // Get examples from relevant datasets
      const examples = await this.getExamplesFromDatasets(relevantDatasets, lastUserMessage)

      if (examples.length === 0) {
        logger.info("No relevant examples found, using original messages")
        return messages
      }

      // Format examples as system messages
      const exampleMessages: Message[] = this.formatExamplesAsSystemMessages(examples)

      // Insert examples at the beginning of the conversation but after any existing system messages
      const systemMessages = messages.filter((m) => m.role === "system")
      const nonSystemMessages = messages.filter((m) => m.role !== "system")

      logger.info("Enhanced conversation with pretraining examples", {
        exampleCount: exampleMessages.length,
      })

      return [...systemMessages, ...exampleMessages, ...nonSystemMessages]
    } catch (error) {
      logger.error("Error enhancing with pretraining", error)
      // Return original messages if enhancement fails
      return messages
    }
  }

  /**
   * Initialize available datasets
   */
  private initializeDatasets(): DatasetInfo[] {
    return [
      {
        id: "general-qa",
        name: "General Q&A Dataset",
        description: "General question-answer pairs covering various topics",
        domain: ["General", "Knowledge", "Facts"],
        complexity: 3,
      },
      {
        id: "programming",
        name: "Programming Q&A",
        description: "Programming and software development questions and answers",
        domain: ["Programming", "Software", "Technology"],
        complexity: 7,
      },
      {
        id: "science",
        name: "Scientific Explanations",
        description: "Scientific concepts and explanations across various disciplines",
        domain: ["Science", "Physics", "Chemistry", "Biology"],
        complexity: 8,
      },
      {
        id: "business",
        name: "Business and Economics",
        description: "Questions related to business, economics, and finance",
        domain: ["Business", "Economics", "Finance", "Management"],
        complexity: 6,
      },
      {
        id: "ai-ml",
        name: "AI and Machine Learning",
        description: "Advanced topics in artificial intelligence and machine learning",
        domain: ["AI", "Machine Learning", "Deep Learning", "Neural Networks"],
        complexity: 9,
      },
      {
        id: "philosophy",
        name: "Philosophy and Ethics",
        description: "Philosophical concepts, theories, and ethical discussions",
        domain: ["Philosophy", "Ethics", "Metaphysics", "Epistemology"],
        complexity: 8,
      },
      {
        id: "history",
        name: "Historical Events and Figures",
        description: "Information about historical events, periods, and important figures",
        domain: ["History", "Civilization", "Culture", "Politics"],
        complexity: 5,
      },
    ]
  }

  /**
   * Select relevant datasets based on query content
   */
  private selectRelevantDatasets(query: string): DatasetInfo[] {
    const lowerQuery = query.toLowerCase()

    // Calculate relevance scores for each dataset
    const datasetScores = this.datasets.map((dataset) => {
      let score = 0

      // Check for domain keyword matches
      dataset.domain.forEach((domain) => {
        if (lowerQuery.includes(domain.toLowerCase())) {
          score += 3
        }
      })

      // Domain-specific keyword matching
      if (this.matchesProgramming(lowerQuery) && dataset.id === "programming") {
        score += 5
      }

      if (this.matchesScience(lowerQuery) && dataset.id === "science") {
        score += 5
      }

      if (this.matchesBusiness(lowerQuery) && dataset.id === "business") {
        score += 5
      }

      if (this.matchesAI(lowerQuery) && dataset.id === "ai-ml") {
        score += 5
      }

      if (this.matchesPhilosophy(lowerQuery) && dataset.id === "philosophy") {
        score += 5
      }

      if (this.matchesHistory(lowerQuery) && dataset.id === "history") {
        score += 5
      }

      // General knowledge gets a base score
      if (dataset.id === "general-qa") score += 1

      return { dataset, score }
    })

    // Sort by score and take top 2
    const selectedDatasets = datasetScores
      .sort((a, b) => b.score - a.score)
      .slice(0, 2)
      .filter((ds) => ds.score > 0)
      .map((ds) => ds.dataset)

    // Always include general knowledge if we have fewer than 2 datasets
    if (selectedDatasets.length === 0) {
      return [this.datasets.find((ds) => ds.id === "general-qa")!]
    }

    return selectedDatasets
  }

  /**
   * Check if query matches programming domain
   */
  private matchesProgramming(query: string): boolean {
    const programmingKeywords = [
      "code",
      "program",
      "function",
      "algorithm",
      "javascript",
      "python",
      "java",
      "c++",
      "html",
      "css",
      "api",
      "database",
      "sql",
      "framework",
      "library",
      "backend",
      "frontend",
      "fullstack",
      "developer",
      "software",
      "git",
      "github",
      "compiler",
      "interpreter",
      "debugging",
      "syntax",
    ]

    return programmingKeywords.some((keyword) => query.includes(keyword))
  }

  /**
   * Check if query matches science domain
   */
  private matchesScience(query: string): boolean {
    const scienceKeywords = [
      "science",
      "physics",
      "chemistry",
      "biology",
      "astronomy",
      "geology",
      "experiment",
      "hypothesis",
      "theory",
      "scientific",
      "molecule",
      "atom",
      "cell",
      "organism",
      "evolution",
      "quantum",
      "relativity",
      "energy",
      "mass",
      "force",
      "reaction",
      "compound",
      "element",
    ]

    return scienceKeywords.some((keyword) => query.includes(keyword))
  }

  /**
   * Check if query matches business domain
   */
  private matchesBusiness(query: string): boolean {
    const businessKeywords = [
      "business",
      "economics",
      "finance",
      "market",
      "company",
      "corporation",
      "startup",
      "entrepreneur",
      "investment",
      "stock",
      "profit",
      "loss",
      "revenue",
      "expense",
      "budget",
      "management",
      "strategy",
      "marketing",
      "sales",
      "customer",
      "product",
      "service",
      "industry",
    ]

    return businessKeywords.some((keyword) => query.includes(keyword))
  }

  /**
   * Check if query matches AI domain
   */
  private matchesAI(query: string): boolean {
    const aiKeywords = [
      "ai",
      "artificial intelligence",
      "machine learning",
      "ml",
      "deep learning",
      "neural network",
      "nlp",
      "natural language processing",
      "computer vision",
      "cv",
      "reinforcement learning",
      "supervised learning",
      "unsupervised learning",
      "model",
      "training",
      "inference",
      "dataset",
      "feature",
      "classification",
      "regression",
      "clustering",
      "transformer",
      "gpt",
      "bert",
    ]

    return aiKeywords.some((keyword) => query.includes(keyword))
  }

  /**
   * Check if query matches philosophy domain
   */
  private matchesPhilosophy(query: string): boolean {
    const philosophyKeywords = [
      "philosophy",
      "ethics",
      "moral",
      "metaphysics",
      "epistemology",
      "logic",
      "existentialism",
      "consciousness",
      "mind",
      "being",
      "existence",
      "knowledge",
      "truth",
      "reality",
      "perception",
      "free will",
      "determinism",
      "virtue",
      "justice",
      "good",
      "evil",
      "right",
      "wrong",
      "meaning",
    ]

    return philosophyKeywords.some((keyword) => query.includes(keyword))
  }

  /**
   * Check if query matches history domain
   */
  private matchesHistory(query: string): boolean {
    const historyKeywords = [
      "history",
      "historical",
      "ancient",
      "medieval",
      "renaissance",
      "modern",
      "century",
      "era",
      "period",
      "civilization",
      "empire",
      "kingdom",
      "dynasty",
      "war",
      "revolution",
      "movement",
      "president",
      "king",
      "queen",
      "emperor",
      "leader",
      "nation",
      "country",
      "culture",
      "society",
    ]

    return historyKeywords.some((keyword) => query.includes(keyword))
  }

  /**
   * Get examples from selected datasets
   */
  private async getExamplesFromDatasets(datasets: DatasetInfo[], query: string): Promise<PretrainingExample[]> {
    try {
      const allExamples: PretrainingExample[] = []

      for (const dataset of datasets) {
        // Check cache first
        if (this.exampleCache.has(dataset.id)) {
          const cachedExamples = this.exampleCache.get(dataset.id)!
          // Select most relevant examples
          const relevantExamples = this.selectRelevantExamples(cachedExamples, query, 2)
          allExamples.push(...relevantExamples)
          continue
        }

        // If not in cache, get examples
        const examples = await this.fetchExamplesForDataset(dataset.id)

        // Cache the examples
        this.exampleCache.set(dataset.id, examples)

        // Select most relevant examples
        const relevantExamples = this.selectRelevantExamples(examples, query, 2)
        allExamples.push(...relevantExamples)
      }

      return allExamples
    } catch (error) {
      logger.error("Error getting examples from datasets", error)
      return []
    }
  }

  /**
   * Fetch examples for a dataset using Hugging Face if available
   */
  private async fetchExamplesForDataset(datasetId: string): Promise<PretrainingExample[]> {
    // Try to use Hugging Face if token is available
    if (this.huggingfaceToken) {
      try {
        logger.info(`Fetching examples for dataset ${datasetId} from Hugging Face`)

        // Map our dataset IDs to Hugging Face dataset names
        const datasetMap: Record<string, string> = {
          "general-qa": "squad",
          programming: "code_x_glue_ct_code_to_text",
          science: "sciq",
          business: "financial_phrasebank",
          "ai-ml": "ai2_arc",
          philosophy: "philosophy_statements",
          history: "history_questions",
        }

        const huggingFaceDataset = datasetMap[datasetId] || "squad"

        // Call Hugging Face API to get examples
        const response = await fetch(`https://api-inference.huggingface.co/models/${huggingFaceDataset}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.huggingfaceToken}`,
          },
          body: JSON.stringify({
            inputs: {
              question: "What is an example question?",
              context: "This is a context for the example.",
            },
          }),
        })

        if (!response.ok) {
          throw new Error(`Hugging Face API error: ${response.status}`)
        }

        const data = await response.json()

        // Process the response into our format
        // This is a simplified example - actual processing would depend on the dataset structure
        if (Array.isArray(data) && data.length > 0) {
          return data.slice(0, 10).map((item: any) => ({
            question: item.question || "What is this about?",
            answer: item.answer || item.text || "This is an example answer.",
          }))
        }

        // If we couldn't get examples from Hugging Face, fall back to mock examples
        logger.warn(`Could not extract examples from Hugging Face response for ${datasetId}, using mock data`)
        return this.getMockExamples(datasetId)
      } catch (error) {
        logger.error(`Error fetching from Hugging Face for ${datasetId}`, error)
        return this.getMockExamples(datasetId)
      }
    }

    // If no Hugging Face token, use mock examples
    return this.getMockExamples(datasetId)
  }

  /**
   * Select most relevant examples from a set
   */
  private selectRelevantExamples(examples: PretrainingExample[], query: string, count: number): PretrainingExample[] {
    // Simple relevance scoring based on word overlap
    const queryWords = new Set(
      query
        .toLowerCase()
        .split(/\W+/)
        .filter((w) => w.length > 3),
    )

    const scoredExamples = examples.map((example) => {
      const questionWords = new Set(
        example.question
          .toLowerCase()
          .split(/\W+/)
          .filter((w) => w.length > 3),
      )
      const answerWords = new Set(
        example.answer
          .toLowerCase()
          .split(/\W+/)
          .filter((w) => w.length > 3),
      )

      // Count overlapping words
      let score = 0
      queryWords.forEach((word) => {
        if (questionWords.has(word)) score += 2
        if (answerWords.has(word)) score += 1
      })

      return { example, score }
    })

    // Sort by score and take top 'count'
    return scoredExamples
      .sort((a, b) => b.score - a.score)
      .slice(0, count)
      .map((item) => item.example)
  }

  /**
   * Format examples as system messages
   */
  private formatExamplesAsSystemMessages(examples: PretrainingExample[]): Message[] {
    return examples.map((example) => ({
      role: "system",
      content: `To answer questions like "${example.question}", respond with: "${example.answer}"`,
      isExample: true,
    }))
  }

  /**
   * Get mock examples for datasets
   */
  private getMockExamples(datasetId: string): PretrainingExample[] {
    const mockDatasets: Record<string, PretrainingExample[]> = {
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
        {
          question: "What causes climate change?",
          answer:
            "Climate change is primarily caused by the greenhouse effect, where gases like carbon dioxide, methane, and nitrous oxide trap heat in Earth's atmosphere. Human activities such as burning fossil fuels, deforestation, and industrial processes have significantly increased the concentration of these greenhouse gases. This enhancement of the natural greenhouse effect leads to global warming, which disrupts climate patterns, raises sea levels, and increases the frequency of extreme weather events.",
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
        {
          question: "What is the difference between let, const, and var in JavaScript?",
          answer:
            "In JavaScript, var, let, and const are used for variable declarations but have different scoping and reassignment behaviors. var is function-scoped, can be redeclared, and is hoisted with a default value of undefined. let is block-scoped, cannot be redeclared within the same scope, and is hoisted without a default value (resulting in a 'temporal dead zone'). const is also block-scoped but additionally prevents reassignment after initialization, though it doesn't make objects immutable. Modern JavaScript best practices generally favor let and const over var for their more predictable scoping behavior.",
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
        {
          question: "How do vaccines work?",
          answer:
            "Vaccines work by training the immune system to recognize and combat pathogens without causing disease. They contain weakened or inactivated parts of a particular organism (antigen) that triggers an immune response. When the vaccine is introduced, the immune system recognizes the antigen as foreign, produces antibodies to fight it, and remembers how to fight that disease in the future. This immunological memory allows the body to quickly recognize and neutralize the harmful organism during future encounters, preventing illness. Modern vaccines include traditional attenuated or inactivated vaccines, subunit vaccines, and newer mRNA vaccines that instruct cells to produce antigens.",
        },
      ],
      business: [
        {
          question: "What is a minimum viable product (MVP)?",
          answer:
            "A Minimum Viable Product (MVP) is a development strategy where a new product is initially released with only core features sufficient to satisfy early adopters. The final, complete set of features is only designed and developed after considering feedback from these initial users. This approach helps minimize risks by allowing businesses to test assumptions about market needs before fully investing in a product. MVPs are central to the lean startup methodology, emphasizing iterative product releases, measuring results, and learning from user feedback.",
        },
        {
          question: "What is the difference between B2B and B2C business models?",
          answer:
            "B2B (Business-to-Business) and B2C (Business-to-Consumer) are distinct business models with different target audiences, sales processes, and marketing strategies. B2B companies sell products or services to other businesses, typically involving longer sales cycles, higher order values, relationship-based selling, and complex decision-making processes with multiple stakeholders. B2C companies sell directly to individual consumers, characterized by shorter sales cycles, lower average order values, emotion-driven purchasing decisions, and mass marketing approaches. Pricing strategies, customer support expectations, and content marketing also differ significantly between these models.",
        },
        {
          question: "What is a SWOT analysis?",
          answer:
            "SWOT analysis is a strategic planning framework used to evaluate the Strengths, Weaknesses, Opportunities, and Threats of a business, project, or individual. Strengths and weaknesses are internal factors that can be controlled or influenced, such as unique selling propositions, expertise, or resource limitations. Opportunities and threats are external factors in the market or environment, such as emerging trends, competitor actions, or regulatory changes. By systematically analyzing these four elements, organizations can develop strategies that leverage strengths, address weaknesses, capitalize on opportunities, and mitigate threats, leading to more informed decision-making and strategic planning.",
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
        {
          question: "What is transfer learning in AI?",
          answer:
            "Transfer learning is a machine learning technique where a model developed for one task is reused as the starting point for a model on a second task. Instead of building a model from scratch, transfer learning leverages knowledge gained from solving one problem and applies it to a different but related problem. This approach is particularly valuable when the target task has limited training data. For example, a neural network trained on a large image dataset can be fine-tuned for a specific image classification task with a smaller dataset. Transfer learning significantly reduces training time, improves model performance, and enables effective learning even with limited data. It's widely used in computer vision and natural language processing applications.",
        },
      ],
      philosophy: [
        {
          question: "What is existentialism?",
          answer:
            "Existentialism is a philosophical movement that emphasizes individual existence, freedom, and choice. It holds that humans define their own meaning in life, and try to make rational decisions despite existing in an irrational universe. Existentialists believe that individuals are entirely free and must take personal responsibility for themselves, although with this responsibility comes angst, a profound anguish or dread. Key existentialist thinkers include Søren Kierkegaard, Friedrich Nietzsche, Jean-Paul Sartre, and Albert Camus. The philosophy is characterized by concepts such as authenticity, absurdity, and the examination of subjective experience rather than objective truths.",
        },
        {
          question: "What is the trolley problem?",
          answer:
            "The trolley problem is a thought experiment in ethics that presents a moral dilemma: You see a runaway trolley moving toward five tied-up people on the tracks. You can pull a lever to redirect the trolley to a different track where only one person is tied up. Should you pull the lever? This dilemma highlights the tension between two moral frameworks: utilitarianism (which would suggest saving five lives at the cost of one is the greater good) and deontological ethics (which might argue that actively causing someone's death, even to save others, is morally wrong). Variations of the problem explore different scenarios and factors that influence moral intuitions, making it a valuable tool for examining ethical principles and moral psychology.",
        },
        {
          question: "What is epistemology?",
          answer:
            "Epistemology is the branch of philosophy concerned with the theory of knowledge, especially regarding its methods, validity, scope, and the distinction between justified belief and opinion. It addresses questions such as: What is knowledge? How is knowledge acquired? To what extent is knowledge possible? What makes justified beliefs justified? Epistemologists examine the standards of evidence, reliability of perception and memory, the role of reason in knowledge, the structure of justification, and skeptical challenges to knowledge claims. Major epistemological positions include rationalism (knowledge primarily from reason), empiricism (knowledge primarily from sensory experience), constructivism (knowledge as constructed rather than discovered), and skepticism (questioning the possibility of certain knowledge).",
        },
      ],
      history: [
        {
          question: "What caused World War I?",
          answer:
            "World War I (1914-1918) was triggered by the assassination of Archduke Franz Ferdinand of Austria-Hungary in June 1914, but its underlying causes were complex and interconnected. Key factors included: militarism and the arms race between European powers; a complex web of alliances (Triple Alliance and Triple Entente) that divided Europe into opposing camps; imperial competition for colonies and resources; nationalism and ethnic tensions, particularly in the Balkans; and domestic political pressures within various countries. The assassination in Sarajevo set off a chain reaction due to these underlying tensions, as Austria-Hungary declared war on Serbia, Russia mobilized to defend Serbia, Germany honored its alliance with Austria-Hungary, and other nations were drawn in through their alliance commitments, ultimately engulfing much of the world in conflict.",
        },
        {
          question: "Who was Cleopatra?",
          answer:
            "Cleopatra VII Philopator (69-30 BCE) was the last active ruler of the Ptolemaic Kingdom of Egypt. A member of the Ptolemaic dynasty, she was a descendant of its founder Ptolemy I Soter, a Macedonian Greek general and companion of Alexander the Great. Though ethnically Greek, Cleopatra embraced Egyptian culture and was the first Ptolemaic ruler to learn the Egyptian language. She is renowned for her intelligence, political acumen, and romantic relationships with Julius Caesar and Mark Antony. Through these alliances, she sought to protect Egypt's independence and expand its influence. Following her defeat alongside Antony at the Battle of Actium in 31 BCE, and facing conquest by Octavian (later Emperor Augustus), she died by suicide, possibly by inducing an asp to bite her. Her death marked the end of the Ptolemaic dynasty and Egypt's annexation by the Roman Empire.",
        },
        {
          question: "What was the Renaissance?",
          answer:
            "The Renaissance was a period of cultural, artistic, political, and economic 'rebirth' that spanned roughly from the 14th to the 17th century, beginning in Italy and later spreading throughout Europe. The term 'Renaissance' means 'rebirth' in French and refers to the revival of interest in classical antiquity, particularly Greek and Roman culture. This period marked the transition from the Middle Ages to modernity and was characterized by significant developments in art (with masters like Leonardo da Vinci, Michelangelo, and Raphael), architecture, music, literature, science, and philosophy. Humanism emerged as a key intellectual movement, emphasizing human potential and achievements. The invention of the printing press by Johannes Gutenberg around 1440 revolutionized communication, making knowledge more accessible and contributing to the spread of new ideas. The Renaissance also saw important political changes, including the rise of powerful city-states in Italy and the strengthening of centralized monarchies in northern Europe.",
        },
      ],
    }

    return mockDatasets[datasetId] || []
  }
}

// Export singleton instance
export const pretrainingService = new PretrainingService()

