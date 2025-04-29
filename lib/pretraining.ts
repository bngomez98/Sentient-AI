import { logger } from "@/lib/logger"
import { ENV } from "@/lib/env-variables"

interface DatasetInfo {
  id: string
  name: string
  description: string
  domain: string[]
  complexity: number
}

interface ExampleMessage {
  role: "system" | "user" | "assistant"
  content: string
}

// Available datasets
const datasets: DatasetInfo[] = [
  {
    id: "general-qa",
    name: "General Q&A",
    description: "General question answering dataset",
    domain: ["general", "knowledge", "information"],
    complexity: 3,
  },
  {
    id: "programming",
    name: "Programming Q&A",
    description: "Programming and code-related questions",
    domain: ["programming", "coding", "software", "development", "computer"],
    complexity: 7,
  },
  {
    id: "science",
    name: "Science Q&A",
    description: "Scientific questions and explanations",
    domain: ["science", "physics", "chemistry", "biology", "scientific"],
    complexity: 8,
  },
  {
    id: "ai-ml",
    name: "AI and Machine Learning",
    description: "AI and machine learning concepts",
    domain: ["ai", "artificial intelligence", "machine learning", "neural", "deep learning"],
    complexity: 9,
  },
]

// Fetch examples from Hugging Face datasets
async function fetchExamplesFromHuggingFace(datasetId: string): Promise<ExampleMessage[]> {
  try {
    // Use the Hugging Face API to fetch dataset examples
    const response = await fetch(`https://huggingface.co/api/datasets/${datasetId}/examples?limit=5`, {
      headers: {
        Authorization: `Bearer ${ENV.HUGGINGFACE_API_TOKEN}`,
      },
    })

    if (!response.ok) {
      logger.error("Failed to fetch examples from Hugging Face", {
        datasetId,
        status: response.status,
      })
      return getDefaultExamples(datasetId)
    }

    const data = await response.json()

    // Transform the data into the expected format
    return data.examples.map((example: any) => ({
      role: example.role || "assistant",
      content: example.content || example.text || "",
    }))
  } catch (error) {
    logger.error("Error fetching from Hugging Face", { datasetId, error })
    return getDefaultExamples(datasetId)
  }
}

// Fallback examples if Hugging Face API fails
function getDefaultExamples(datasetId: string): ExampleMessage[] {
  const defaultExamples: Record<string, ExampleMessage[]> = {
    "general-qa": [
      {
        role: "user",
        content: "What is the capital of France?",
      },
      {
        role: "assistant",
        content:
          "The capital of France is Paris. Paris is also the largest city in France and one of the most visited cities in the world, known for landmarks such as the Eiffel Tower, the Louvre Museum, and Notre-Dame Cathedral.",
      },
    ],
    programming: [
      {
        role: "user",
        content: "How do I create a simple HTTP server in Node.js?",
      },
      {
        role: "assistant",
        content: `To create a simple HTTP server in Node.js, you can use the built-in 'http' module. Here's a basic example:

\`\`\`javascript
const http = require('http');

// Create the server
const server = http.createServer((req, res) => {
  // Set the response headers
  res.writeHead(200, {'Content-Type': 'text/plain'});
  
  // Send the response
  res.end('Hello, World!\\n');
});

// Define the port to listen on
const port = 3000;

// Start the server
server.listen(port, () => {
  console.log(\`Server running at http://localhost:\${port}/\`);
});
\`\`\`

Save this code to a file (e.g., 'server.js') and run it with Node.js:

\`\`\`bash
node server.js
\`\`\`

This creates a server that responds with "Hello, World!" to all requests. You can access it by opening a browser and navigating to http://localhost:3000/.`,
      },
    ],
    science: [
      {
        role: "user",
        content: "Can you explain how photosynthesis works?",
      },
      {
        role: "assistant",
        content: `Photosynthesis is the process by which plants, algae, and some bacteria convert light energy, usually from the sun, into chemical energy in the form of glucose or other sugars.

The basic equation for photosynthesis is:
6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂

This process occurs in two main stages:

1. Light-dependent reactions:
   - Take place in the thylakoid membrane of the chloroplast
   - Chlorophyll and other pigments absorb light energy
   - Water molecules are split, releasing oxygen as a byproduct
   - ATP (energy) and NADPH (reducing power) are produced

2. Light-independent reactions (Calvin cycle):
   - Take place in the stroma of the chloroplast
   - Carbon dioxide is incorporated into organic molecules
   - ATP and NADPH from the light-dependent reactions provide energy
   - Glucose and other carbohydrates are synthesized

The glucose produced can be used immediately for energy, converted into other organic compounds, or stored as starch for later use. Photosynthesis is crucial for life on Earth as it produces oxygen and serves as the primary source of energy for most ecosystems.`,
      },
    ],
    "ai-ml": [
      {
        role: "user",
        content: "What's the difference between supervised and unsupervised learning?",
      },
      {
        role: "assistant",
        content: `Supervised and unsupervised learning are two fundamental approaches in machine learning:

**Supervised Learning:**
- Requires labeled training data with input-output pairs
- The algorithm learns to map inputs to correct outputs
- Goal: Predict outputs for new, unseen inputs
- Performance is measured by comparing predictions to known correct answers
- Examples: Classification (spam detection, image recognition) and regression (price prediction, temperature forecasting)
- Algorithms: Linear/Logistic Regression, Decision Trees, Random Forests, SVMs, Neural Networks

**Unsupervised Learning:**
- Works with unlabeled data
- The algorithm identifies patterns, structures, or relationships within the data
- Goal: Discover hidden patterns or intrinsic structures
- No explicit performance measure based on outputs
- Examples: Clustering (customer segmentation, anomaly detection) and dimensionality reduction (feature extraction, visualization)
- Algorithms: K-means, Hierarchical Clustering, DBSCAN, PCA, t-SNE, Autoencoders

**Key Differences:**
1. **Labeled Data**: Supervised learning requires labeled data; unsupervised learning does not
2. **Feedback**: Supervised learning receives explicit feedback; unsupervised learning has no feedback
3. **Complexity**: Supervised learning is generally simpler to evaluate; unsupervised learning can be more complex to validate
4. **Applications**: Supervised learning is used for prediction tasks; unsupervised learning is used for pattern discovery and data exploration
5. **Data Requirements**: Supervised learning typically requires more human effort for labeling; unsupervised learning can work with raw data`,
      },
    ],
  }

  return defaultExamples[datasetId] || []
}

/**
 * Select relevant datasets based on query content
 */
export function selectRelevantDatasets(query: string): DatasetInfo[] {
  try {
    const lowerQuery = query.toLowerCase()

    // Calculate relevance scores for each dataset
    const datasetScores = datasets.map((dataset) => {
      let score = 0

      // Check for domain keyword matches
      dataset.domain.forEach((domain) => {
        if (lowerQuery.includes(domain)) {
          score += 2
        }
      })

      // Check for dataset name match
      if (lowerQuery.includes(dataset.name.toLowerCase())) {
        score += 3
      }

      return { dataset, score }
    })

    // Sort by score and take top 2
    const selectedDatasets = datasetScores
      .sort((a, b) => b.score - a.score)
      .slice(0, 2)
      .filter((item) => item.score > 0)
      .map((item) => item.dataset)

    return selectedDatasets
  } catch (error) {
    logger.error("Error selecting relevant datasets", error)
    return [] // Return empty array on error
  }
}
