"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Database, ChevronDown, ChevronUp, BookOpen } from "lucide-react"

interface DatasetInfoProps {
  datasetName: string
  sampleCount: number
  onViewSamples?: () => void
}

export function DatasetInfo({ datasetName, sampleCount, onViewSamples }: DatasetInfoProps) {
  const [expanded, setExpanded] = useState(false)

  // Get dataset description based on name
  const getDatasetInfo = (name: string) => {
    const datasets: Record<string, { description: string; categories: string[] }> = {
      "GeneralReasoning/GeneralThought-195K": {
        description: "A comprehensive dataset of general reasoning examples with diverse thought processes.",
        categories: ["reasoning", "general", "thought"],
      },
      "tatsu-lab/alpaca": {
        description: "Instruction-following dataset with diverse tasks for language models.",
        categories: ["instruction", "general", "qa"],
      },
      "databricks/databricks-dolly-15k": {
        description: "Instruction dataset with reasoning and QA examples from Databricks.",
        categories: ["instruction", "reasoning", "qa"],
      },
      "OpenAssistant/oasst1": {
        description: "Conversational assistant dataset with high-quality responses from the OpenAssistant project.",
        categories: ["conversation", "assistant", "qa"],
      },
      "Anthropic/hh-rlhf": {
        description: "Helpful and harmless responses to diverse queries from Anthropic.",
        categories: ["helpful", "instruction", "ethics"],
      },
      "bigscience/P3": {
        description: "Public Pool of Prompts dataset with diverse tasks from the BigScience project.",
        categories: ["multilingual", "instruction", "diverse"],
      },
      "EleutherAI/pile": {
        description: "Large-scale diverse text dataset for knowledge-intensive tasks from EleutherAI.",
        categories: ["general", "knowledge", "code"],
      },
      squad_v2: {
        description: "Question answering dataset based on Wikipedia articles.",
        categories: ["qa", "reading", "comprehension"],
      },
      "backup-reasoning-dataset": {
        description: "Curated backup dataset with high-quality reasoning examples.",
        categories: ["reasoning", "general", "curated"],
      },
    }

    return (
      datasets[name] || {
        description: "Custom dataset with specialized examples.",
        categories: ["custom"],
      }
    )
  }

  const datasetInfo = getDatasetInfo(datasetName)

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">Pretraining Dataset</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)} className="h-8 w-8 p-0">
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
        <CardDescription>
          {datasetName} ({sampleCount} samples)
        </CardDescription>
      </CardHeader>

      {expanded && (
        <CardContent>
          <p className="text-sm mb-3">{datasetInfo.description}</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {datasetInfo.categories.map((category) => (
              <Badge key={category} variant="secondary">
                {category}
              </Badge>
            ))}
          </div>
          {onViewSamples && (
            <Button variant="outline" size="sm" onClick={onViewSamples} className="w-full">
              <BookOpen className="h-4 w-4 mr-2" />
              View Sample Examples
            </Button>
          )}
        </CardContent>
      )}
    </Card>
  )
}

