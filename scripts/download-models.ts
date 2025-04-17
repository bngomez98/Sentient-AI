import * as fs from "fs"
import * as path from "path"
import fetch from "node-fetch"
import { execSync } from "child_process"

// Define model sources
const MODEL_SOURCES = [
  {
    name: "sentiment",
    version: "v1",
    url: "https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/model.json",
    metadataUrl: "https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/metadata.json",
  },
  {
    name: "toxicity",
    version: "v1",
    url: "https://storage.googleapis.com/tfjs-models/tfjs/toxicity/1/model.json",
    metadataUrl: "https://storage.googleapis.com/tfjs-models/tfjs/toxicity/1/metadata.json",
  },
  {
    name: "classification",
    version: "v1",
    url: "https://storage.googleapis.com/tfjs-models/tfjs/universal-sentence-encoder-lite/1/model.json",
    metadataUrl: null,
  },
]

// Create models directory
const MODELS_DIR = path.join(process.cwd(), "public", "models")

async function downloadFile(url: string, outputPath: string): Promise<void> {
  console.log(`Downloading ${url} to ${outputPath}`)

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.statusText}`)
  }

  const fileStream = fs.createWriteStream(outputPath)
  await new Promise((resolve, reject) => {
    response.body.pipe(fileStream)
    response.body.on("error", reject)
    fileStream.on("finish", resolve)
  })
}

async function downloadModel(modelInfo: (typeof MODEL_SOURCES)[0]): Promise<void> {
  const modelDir = path.join(MODELS_DIR, modelInfo.name, modelInfo.version)

  // Create directory
  fs.mkdirSync(modelDir, { recursive: true })

  // Download model.json
  const modelJsonPath = path.join(modelDir, "model.json")
  await downloadFile(modelInfo.url, modelJsonPath)

  // Parse model.json to get weights files
  const modelJson = JSON.parse(fs.readFileSync(modelJsonPath, "utf8"))

  // Download weights files
  if (modelJson.weightsManifest) {
    for (const group of modelJson.weightsManifest) {
      for (const path of group.paths) {
        const weightUrl = new URL(path, modelInfo.url).toString()
        const weightPath = path.join(modelDir, path)
        await downloadFile(weightUrl, weightPath)
      }
    }
  }

  // Download metadata if available
  if (modelInfo.metadataUrl) {
    await downloadFile(modelInfo.metadataUrl, path.join(modelDir, "metadata.json"))
  } else {
    // Create basic metadata
    const metadata = {
      name: modelInfo.name,
      version: modelInfo.version,
      description: `${modelInfo.name} model`,
      dateCreated: new Date().toISOString(),
      framework: "tensorflow",
    }
    fs.writeFileSync(path.join(modelDir, "metadata.json"), JSON.stringify(metadata, null, 2))
  }

  console.log(`Downloaded model: ${modelInfo.name} (version: ${modelInfo.version})`)
}

async function main() {
  try {
    // Check if tensorflowjs-converter is installed
    try {
      execSync("tensorflowjs_converter --version")
      console.log("TensorFlow.js converter is installed")
    } catch (error) {
      console.error("TensorFlow.js converter is not installed. Installing...")
      execSync("pip install tensorflowjs")
    }

    // Create models directory
    fs.mkdirSync(MODELS_DIR, { recursive: true })

    // Download all models
    for (const modelInfo of MODEL_SOURCES) {
      await downloadModel(modelInfo)
    }

    console.log("All models downloaded successfully")
  } catch (error) {
    console.error("Error downloading models:", error)
    process.exit(1)
  }
}

main()

