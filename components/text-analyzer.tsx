"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, AlertCircle, Check, Brain, MessageSquare, Shield, Zap } from "lucide-react"
import {
  tensorflowClient,
  type SentimentPrediction,
  type ToxicityPrediction,
  type ClassificationPrediction,
} from "@/lib/tensorflow-client"

export function TextAnalyzer() {
  const [text, setText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isModelLoading, setIsModelLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("sentiment")
  const [error, setError] = useState<string | null>(null)
  const [modelInitialized, setModelInitialized] = useState(false)

  // Analysis results
  const [sentimentResult, setSentimentResult] = useState<SentimentPrediction | null>(null)
  const [toxicityResult, setToxicityResult] = useState<ToxicityPrediction | null>(null)
  const [classificationResult, setClassificationResult] = useState<ClassificationPrediction | null>(null)

  // Initialize TensorFlow.js on component mount
  useEffect(() => {
    async function initTensorflow() {
      try {
        setIsModelLoading(true)
        const initialized = await tensorflowClient.initialize()
        setModelInitialized(initialized)
      } catch (err) {
        setError("Failed to initialize TensorFlow.js. Please check if your browser supports WebGL.")
      } finally {
        setIsModelLoading(false)
      }
    }

    initTensorflow()

    // Cleanup on unmount
    return () => {
      tensorflowClient.unloadModels()
    }
  }, [])

  // Handle text change
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
  }

  // Handle analyze button click
  const handleAnalyze = async () => {
    if (!text.trim() || isAnalyzing) return

    setIsAnalyzing(true)
    setError(null)

    try {
      // Analyze based on active tab
      switch (activeTab) {
        case "sentiment":
          const sentimentResult = await tensorflowClient.analyzeSentiment(text)
          setSentimentResult(sentimentResult)
          break

        case "toxicity":
          const toxicityResult = await tensorflowClient.analyzeToxicity(text)
          setToxicityResult(toxicityResult)
          break

        case "classification":
          const classificationResult = await tensorflowClient.classifyText(text)
          setClassificationResult(classificationResult)
          break
      }
    } catch (err) {
      setError(`Analysis failed: ${err instanceof Error ? err.message : "Unknown error"}`)
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Render sentiment result
  const renderSentimentResult = () => {
    if (!sentimentResult) return null

    const { score, confidence } = sentimentResult
    const sentimentLabel = score > 0.2 ? "Positive" : score < -0.2 ? "Negative" : "Neutral"
    const sentimentColor = score > 0.2 ? "bg-green-500" : score < -0.2 ? "bg-red-500" : "bg-yellow-500"

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Sentiment Score</span>
          <Badge variant={score > 0 ? "success" : score < 0 ? "destructive" : "secondary"}>{sentimentLabel}</Badge>
        </div>

        <div className="relative h-4 w-full bg-secondary rounded-full overflow-hidden">
          <div
            className="absolute top-0 bottom-0 left-1/2 w-1 bg-foreground z-10"
            style={{ transform: "translateX(-50%)" }}
          ></div>
          <div
            className={`absolute top-0 bottom-0 left-1/2 ${sentimentColor} transition-all duration-500`}
            style={{
              width: `${Math.abs(score) * 100}%`,
              transform: `translateX(${score < 0 ? "-100%" : "0%"})`,
            }}
          ></div>
        </div>

        <div className="text-sm text-muted-foreground text-center">Score: {score.toFixed(2)} (range: -1 to 1)</div>

        <div className="space-y-2 mt-4">
          <div className="flex justify-between text-sm">
            <span>Confidence</span>
            <span>{Math.round(confidence * 100)}%</span>
          </div>
          <Progress value={confidence * 100} className="h-2" />
        </div>
      </div>
    )
  }

  // Render toxicity result
  const renderToxicityResult = () => {
    if (!toxicityResult) return null

    const { toxic, toxicityScore, categories } = toxicityResult

    return (
      <div className="space-y-4">
        <Alert variant={toxic ? "destructive" : "default"}>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Content {toxic ? "may be toxic" : "appears safe"}</AlertTitle>
          <AlertDescription>Overall toxicity score: {Math.round(toxicityScore * 100)}%</AlertDescription>
        </Alert>

        <div className="space-y-3 mt-4">
          <h4 className="text-sm font-medium">Category Breakdown</h4>
          {Object.entries(categories).map(([category, score]) => (
            <div key={category} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="capitalize">{category.replace("_", " ")}</span>
                <span>{Math.round(score * 100)}%</span>
              </div>
              <Progress
                value={score * 100}
                className="h-2"
                indicatorClassName={score > 0.5 ? "bg-destructive" : score > 0.3 ? "bg-amber-500" : "bg-emerald-500"}
              />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Render classification result
  const renderClassificationResult = () => {
    if (!classificationResult) return null

    const { label, score, allLabels } = classificationResult

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Primary Category</span>
          <Badge variant="outline" className="capitalize">
            {label.replace("_", " ")}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Confidence</span>
            <span>{Math.round(score * 100)}%</span>
          </div>
          <Progress value={score * 100} className="h-2" />
        </div>

        <div className="space-y-3 mt-4">
          <h4 className="text-sm font-medium">All Categories</h4>
          <div className="grid grid-cols-2 gap-2">
            {allLabels.slice(0, 6).map((item) => (
              <div key={item.label} className="flex items-center justify-between bg-muted p-2 rounded-md">
                <span className="text-xs capitalize">{item.label.replace("_", " ")}</span>
                <Badge variant="secondary" className="text-xs">
                  {Math.round(item.score * 100)}%
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Text Analysis with TensorFlow.js
        </CardTitle>
        <CardDescription>Analyze text using client-side machine learning models</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Textarea
          placeholder="Enter text to analyze..."
          value={text}
          onChange={handleTextChange}
          className="min-h-[100px] resize-none"
          disabled={isAnalyzing || isModelLoading}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="sentiment" disabled={isAnalyzing}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Sentiment
            </TabsTrigger>
            <TabsTrigger value="toxicity" disabled={isAnalyzing}>
              <Shield className="h-4 w-4 mr-2" />
              Toxicity
            </TabsTrigger>
            <TabsTrigger value="classification" disabled={isAnalyzing}>
              <Zap className="h-4 w-4 mr-2" />
              Classification
            </TabsTrigger>
          </TabsList>

          <div className="mt-4 min-h-[200px]">
            <TabsContent value="sentiment" className="mt-0">
              {sentimentResult ? (
                renderSentimentResult()
              ) : (
                <div className="flex items-center justify-center h-[200px] text-center text-muted-foreground">
                  {isAnalyzing ? (
                    <Loader2 className="h-8 w-8 animate-spin" />
                  ) : (
                    <p>Analyze text to see sentiment results</p>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="toxicity" className="mt-0">
              {toxicityResult ? (
                renderToxicityResult()
              ) : (
                <div className="flex items-center justify-center h-[200px] text-center text-muted-foreground">
                  {isAnalyzing ? (
                    <Loader2 className="h-8 w-8 animate-spin" />
                  ) : (
                    <p>Analyze text to see toxicity results</p>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="classification" className="mt-0">
              {classificationResult ? (
                renderClassificationResult()
              ) : (
                <div className="flex items-center justify-center h-[200px] text-center text-muted-foreground">
                  {isAnalyzing ? (
                    <Loader2 className="h-8 w-8 animate-spin" />
                  ) : (
                    <p>Analyze text to see classification results</p>
                  )}
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>

      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          {modelInitialized ? (
            <span className="flex items-center">
              <Check className="h-4 w-4 text-green-500 mr-1" />
              TensorFlow.js initialized
            </span>
          ) : isModelLoading ? (
            <span className="flex items-center">
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
              Initializing TensorFlow.js...
            </span>
          ) : (
            <span className="flex items-center">
              <AlertCircle className="h-4 w-4 text-amber-500 mr-1" />
              TensorFlow.js not initialized
            </span>
          )}
        </div>

        <Button onClick={handleAnalyze} disabled={!text.trim() || isAnalyzing || isModelLoading || !modelInitialized}>
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Brain className="mr-2 h-4 w-4" />
              Analyze
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

