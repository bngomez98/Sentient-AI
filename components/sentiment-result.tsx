"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface SentimentResultProps {
  result: {
    text: string
    sentiment: string
    confidence: number
    sentiment_score: number
  }
  usedFallback?: boolean
}

export function SentimentResult({ result, usedFallback = false }: SentimentResultProps) {
  const isPositive = result.sentiment === "positive"
  const confidencePercent = Math.round(result.confidence * 100)

  return (
    <Card className={`p-6 border-l-4 ${isPositive ? "border-l-blue-500" : "border-l-red-500"}`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isPositive ? (
              <CheckCircle className="h-6 w-6 text-blue-500" />
            ) : (
              <XCircle className="h-6 w-6 text-red-500" />
            )}
            <h3 className="text-lg font-medium">{isPositive ? "Positive" : "Negative"} Sentiment</h3>
          </div>

          {usedFallback && (
            <Badge variant="outline" className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              <span>AI Analysis</span>
            </Badge>
          )}
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Confidence</span>
            <span className="text-sm font-medium">{confidencePercent}%</span>
          </div>
          <Progress
            value={confidencePercent}
            className={`h-2 ${isPositive ? "bg-blue-100 dark:bg-blue-950/30" : "bg-red-100 dark:bg-red-950/30"}`}
            indicatorClassName={isPositive ? "bg-blue-500" : "bg-red-500"}
          />
        </div>

        <div className="p-3 bg-muted rounded-md">
          <p className="text-sm text-foreground/80 italic">"{result.text}"</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Sentiment Score</p>
            <p className="font-medium">{result.sentiment_score.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Classification</p>
            <p className="font-medium capitalize">{result.sentiment}</p>
          </div>
        </div>
      </div>
    </Card>
  )
}

