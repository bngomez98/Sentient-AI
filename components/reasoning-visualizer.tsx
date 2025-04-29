"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BrainCircuit, Lightbulb, Sparkles, Zap, Network, Cpu, BookOpen, MessageSquare } from "lucide-react"
import type { ReasoningStep } from "@/lib/reasoning"
import { Badge } from "@/components/ui/badge"

interface ReasoningVisualizerProps {
  steps: ReasoningStep[]
}

export function ReasoningVisualizer({ steps = [] }: ReasoningVisualizerProps) {
  if (!steps || steps.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20 text-center">
        <BrainCircuit className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">No Reasoning Data Available</h2>
        <p className="text-muted-foreground max-w-md">
          Send a message to see Sentient-1's reasoning process and how it processes your request.
        </p>
      </div>
    )
  }

  // Get appropriate icon for each step
  const getStepIcon = (stepDescription: string) => {
    if (stepDescription.includes("complexity")) return <Cpu className="h-4 w-4 text-blue-500" />
    if (stepDescription.includes("concepts")) return <Lightbulb className="h-4 w-4 text-amber-500" />
    if (stepDescription.includes("domains")) return <BookOpen className="h-4 w-4 text-emerald-500" />
    if (stepDescription.includes("context")) return <MessageSquare className="h-4 w-4 text-purple-500" />
    if (stepDescription.includes("intent")) return <Zap className="h-4 w-4 text-orange-500" />
    if (stepDescription.includes("sentiment")) return <Sparkles className="h-4 w-4 text-rose-500" />
    if (stepDescription.includes("approach")) return <BrainCircuit className="h-4 w-4 text-primary" />
    if (stepDescription.includes("knowledge")) return <Network className="h-4 w-4 text-indigo-500" />
    if (stepDescription.includes("structure")) return <Cpu className="h-4 w-4 text-cyan-500" />

    // Default icon
    return <BrainCircuit className="h-4 w-4 text-primary" />
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold">Reasoning Process</h2>
        </div>
        <p className="text-muted-foreground mt-1">
          See how Sentient-1 processes your request through multiple reasoning steps
        </p>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <Card key={index} className="transition-all hover:shadow-md border-l-4 border-l-primary">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStepIcon(step.description)}
                  <CardTitle className="text-base">{step.description}</CardTitle>
                </div>
                <Badge variant="outline">
                  Step {index + 1}/{steps.length}
                </Badge>
              </div>
              <CardDescription>
                {index === 0
                  ? "Initial analysis"
                  : index === steps.length - 1
                    ? "Final reasoning"
                    : `Intermediate reasoning step ${index + 1}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="bg-card">
                <AlertDescription className="whitespace-pre-wrap">{step.result}</AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
