import { TextAnalyzer } from "@/components/text-analyzer"

export default function AnalyzePage() {
  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Text Analysis</h1>
        <p className="text-muted-foreground mb-8">
          Analyze text using TensorFlow.js models running directly in your browser. No data is sent to any server - all
          processing happens locally.
        </p>

        <TextAnalyzer />

        <div className="mt-8 text-sm text-muted-foreground">
          <h2 className="text-lg font-medium mb-2">About this feature</h2>
          <p>
            This page demonstrates client-side machine learning using TensorFlow.js. The models are loaded and executed
            directly in your browser, providing privacy-preserving analysis without sending your text to any server.
          </p>
          <p className="mt-2">
            Models are automatically cached for better performance. You can analyze multiple texts without reloading the
            models.
          </p>
        </div>
      </div>
    </div>
  )
}

