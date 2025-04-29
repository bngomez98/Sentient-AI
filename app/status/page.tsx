"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react"

interface ApiStatus {
  status: string
  model?: string
  response?: string
  message?: string
  statusCode?: number
}

interface TestResults {
  timestamp: string
  apis: {
    perplexity: ApiStatus
    openai: ApiStatus
    huggingface: ApiStatus
  }
}

export default function StatusPage() {
  const [results, setResults] = useState<TestResults | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testConnections = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/test-connection")

      if (!res.ok) {
        throw new Error(`Error: ${res.status}`)
      }

      const data = await res.json()
      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    testConnections()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "not_configured":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Sentient-1 System Status</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>API Connection Status</span>
            <Button variant="outline" size="sm" onClick={testConnections} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {loading ? "Testing..." : "Test Connections"}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">{error}</div>
          ) : loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : results ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Perplexity API</h3>
                      {getStatusIcon(results.apis.perplexity.status)}
                    </div>
                    {results.apis.perplexity.status === "success" ? (
                      <div className="text-sm">
                        <p className="text-gray-500">Model: {results.apis.perplexity.model}</p>
                        <p className="text-gray-500">Response: {results.apis.perplexity.response}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        {results.apis.perplexity.message || "No details available"}
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">OpenAI API</h3>
                      {getStatusIcon(results.apis.openai.status)}
                    </div>
                    {results.apis.openai.status === "success" ? (
                      <div className="text-sm">
                        <p className="text-gray-500">Model: {results.apis.openai.model}</p>
                        <p className="text-gray-500">Response: {results.apis.openai.response}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">{results.apis.openai.message || "No details available"}</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Hugging Face API</h3>
                      {getStatusIcon(results.apis.huggingface.status)}
                    </div>
                    {results.apis.huggingface.status === "success" ? (
                      <div className="text-sm">
                        <p className="text-gray-500">Response: {results.apis.huggingface.response}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        {results.apis.huggingface.message || "No details available"}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="text-xs text-gray-500 text-right">
                Last tested: {new Date(results.timestamp).toLocaleString()}
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No test results available</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">API Configuration</h3>
              <ul className="space-y-1 text-sm">
                <li className="flex justify-between">
                  <span>Perplexity API:</span>
                  <span className={results?.apis.perplexity.status === "success" ? "text-green-600" : "text-red-600"}>
                    {results?.apis.perplexity.status === "success" ? "Working" : "Not Working"}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>OpenAI API:</span>
                  <span className={results?.apis.openai.status === "success" ? "text-green-600" : "text-red-600"}>
                    {results?.apis.openai.status === "success" ? "Working" : "Not Working"}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Hugging Face API:</span>
                  <span className={results?.apis.huggingface.status === "success" ? "text-green-600" : "text-red-600"}>
                    {results?.apis.huggingface.status === "success" ? "Working" : "Not Working"}
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-2">Feature Status</h3>
              <ul className="space-y-1 text-sm">
                <li className="flex justify-between">
                  <span>Chat API:</span>
                  <span
                    className={
                      results?.apis.perplexity.status === "success" || results?.apis.openai.status === "success"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {results?.apis.perplexity.status === "success" || results?.apis.openai.status === "success"
                      ? "Available"
                      : "Unavailable"}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Pretraining:</span>
                  <span
                    className={results?.apis.huggingface.status === "success" ? "text-green-600" : "text-yellow-600"}
                  >
                    {results?.apis.huggingface.status === "success" ? "Available" : "Limited"}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>RAG:</span>
                  <span className="text-green-600">Available (Local)</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
