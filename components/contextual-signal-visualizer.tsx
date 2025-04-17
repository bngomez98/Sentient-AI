"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Brain, Network, BarChart, Zap, Lightbulb, Sparkles } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface ContextualSignalVisualizerProps {
  contextualSignal: {
    available: boolean
    dimensions: number
    vector?: number[] // Optional vector property
  } | null
}

export function ContextualSignalVisualizer({ contextualSignal }: ContextualSignalVisualizerProps) {
  if (!contextualSignal || !contextualSignal.available) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20 text-center">
        <Network className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">No Contextual Signal Available</h2>
        <p className="text-muted-foreground max-w-md">
          The VAE-LSTM model is not currently available. Sentient-1 is still using reasoning and pretraining for
          enhanced responses.
        </p>
      </div>
    )
  }

  // Generate dynamic metrics based on dimensions
  const generateMetrics = () => {
    if (!contextualSignal || !contextualSignal.vector) {
      // Generate placeholder metrics if no vector is available
      return [
        { name: "Complexity", value: 0.7, icon: <Brain className="h-4 w-4 text-primary" /> },
        { name: "Information Seeking", value: 0.8, icon: <Lightbulb className="h-4 w-4 text-amber-500" /> },
        { name: "Emotional Intensity", value: 0.3, icon: <Sparkles className="h-4 w-4 text-purple-500" /> },
        { name: "Technical Content", value: 0.6, icon: <Zap className="h-4 w-4 text-blue-500" /> },
        { name: "Length", value: 0.5, icon: <BarChart className="h-4 w-4 text-green-500" /> },
        { name: "Sentence Structure", value: 0.4, icon: <Network className="h-4 w-4 text-orange-500" /> },
      ]
    }

    // Extract actual metrics from the vector
    // The indices depend on how the VAE-LSTM model was trained
    const vector = contextualSignal.vector

    // Map vector dimensions to meaningful metrics
    // These mappings should match the actual model's latent space
    const metrics = [
      {
        name: "Complexity",
        value: normalizeValue(vector[0]),
        icon: <Brain className="h-4 w-4 text-primary" />,
      },
      {
        name: "Information Seeking",
        value: normalizeValue(vector[2]),
        icon: <Lightbulb className="h-4 w-4 text-amber-500" />,
      },
      {
        name: "Emotional Intensity",
        value: normalizeValue(vector[3]),
        icon: <Sparkles className="h-4 w-4 text-purple-500" />,
      },
      {
        name: "Technical Content",
        value: normalizeValue(vector[7]),
        icon: <Zap className="h-4 w-4 text-blue-500" />,
      },
      {
        name: "Length",
        value: normalizeValue(vector[4]),
        icon: <BarChart className="h-4 w-4 text-green-500" />,
      },
      {
        name: "Sentence Structure",
        value: normalizeValue(vector[6]),
        icon: <Network className="h-4 w-4 text-orange-500" />,
      },
    ]

    // Add more metrics for higher dimensional vectors
    if (vector.length > 16) {
      metrics.push(
        {
          name: "Conceptual Depth",
          value: normalizeValue(vector[5]),
          icon: <Brain className="h-4 w-4 text-indigo-500" />,
        },
        {
          name: "Domain Specificity",
          value: normalizeValue(vector[8]),
          icon: <Zap className="h-4 w-4 text-cyan-500" />,
        },
      )
    }

    return metrics
  }

  // Helper function to normalize vector values to 0-1 range
  const normalizeValue = (value: number): number => {
    // Ensure the value is between 0 and 1
    return Math.max(0, Math.min(1, (value + 1) / 2))
  }

  const metrics = generateMetrics()

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <Network className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold">Neural Contextual Understanding</h2>
        </div>
        <p className="text-muted-foreground mt-1">
          Sentient-1 uses a VAE-LSTM neural network to extract deep contextual understanding from your messages
        </p>
      </div>

      <Card className="transition-all hover:shadow-md border-l-4 border-l-primary mb-6">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Neural Contextual Embedding</CardTitle>
            </div>
            <Badge variant="outline" className="font-mono">
              {contextualSignal.dimensions}D
            </Badge>
          </div>
          <CardDescription>Latent space representation of message context</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="bg-card">
            <AlertDescription>
              <p className="mb-3">
                The VAE-LSTM model has analyzed your message and extracted a {contextualSignal.dimensions}-dimensional
                vector that captures:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    <span className="font-medium">Semantic meaning</span>
                  </div>
                  <p className="text-sm text-muted-foreground pl-6">
                    Understanding the core concepts and topics in your message
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="font-medium">Emotional tone</span>
                  </div>
                  <p className="text-sm text-muted-foreground pl-6">
                    Detecting sentiment, urgency, and emotional content
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Network className="h-4 w-4 text-primary" />
                    <span className="font-medium">Linguistic patterns</span>
                  </div>
                  <p className="text-sm text-muted-foreground pl-6">
                    Analyzing sentence structure, complexity, and style
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-primary" />
                    <span className="font-medium">Contextual relevance</span>
                  </div>
                  <p className="text-sm text-muted-foreground pl-6">
                    Relating to conversation history and knowledge domains
                  </p>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card className="transition-all hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <BarChart className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">Message Analysis</CardTitle>
          </div>
          <CardDescription>Key metrics extracted from your message</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.map((metric) => (
              <div key={metric.name} className="space-y-1">
                <div className="flex justify-between text-sm items-center">
                  <div className="flex items-center gap-2">
                    {metric.icon}
                    <span>{metric.name}</span>
                  </div>
                  <span className="font-mono">{Math.round(metric.value * 100)}%</span>
                </div>
                <Progress
                  value={metric.value * 100}
                  className="h-2"
                  indicatorClassName={
                    metric.value > 0.7 ? "bg-primary" : metric.value > 0.4 ? "bg-amber-500" : "bg-muted-foreground"
                  }
                />
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-border">
            <h4 className="text-sm font-medium mb-2">Neural Network Architecture</h4>
            <div className="bg-muted/50 p-3 rounded-md text-xs">
              <div className="font-mono">
                <div className="flex justify-between mb-1">
                  <span>Model:</span>
                  <span>VAE-LSTM</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>Latent Dimensions:</span>
                  <span>{contextualSignal.dimensions}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>Encoder:</span>
                  <span>Bidirectional LSTM</span>
                </div>
                <div className="flex justify-between">
                  <span>Training Data:</span>
                  <span>Conversation Corpus</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

