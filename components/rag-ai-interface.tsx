"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PhysicsVisualizer from "./physics-visualizer"
import { ENV } from "@/lib/env-variables"

interface Document {
  id: string
  content: string
  metadata: Record<string, any>
}

interface RagAIResponse {
  content: string
  contextualDocuments?: Document[]
  physicsSimulation?: {
    modelId: string
    timeElapsed: number
  }
  ragEnabled?: boolean
  timestamp?: string
  error?: string
}

export default function RagAIInterface() {
  const [query, setQuery] = useState("")
  const [response, setResponse] = useState<RagAIResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [simulationState, setSimulationState] = useState<any>(null)

  // Function to submit query to RAG AI
  const submitQuery = async () => {
    if (!query.trim()) return

    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/rag-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      })

      if (!res.ok) {
        throw new Error(`Error: ${res.status}`)
      }

      const data = await res.json()
      setResponse(data)

      // Generate mock simulation state for visualization
      // In a real implementation, this would come from the backend
      if (data.physicsSimulation) {
        generateMockSimulationState(data.physicsSimulation.modelId)
      } else {
        setSimulationState(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  // Generate mock simulation state for visualization
  const generateMockSimulationState = (modelId: string) => {
    // Create a basic ragdoll model
    const height = 1.8
    const headSize = height * 0.15
    const torsoHeight = height * 0.3
    const torsoWidth = height * 0.2
    const armLength = height * 0.3
    const legLength = height * 0.45

    // Add some randomness to positions to simulate physics
    const randomOffset = () => (Math.random() - 0.5) * 0.2

    const mockState = {
      time: 3.0,
      models: [
        {
          id: modelId,
          bodies: [
            // Head
            {
              id: `${modelId}_head`,
              position: {
                x: randomOffset(),
                y: height - headSize / 2 + randomOffset(),
                z: randomOffset(),
              },
              rotation: {
                x: Math.random() * 0.5,
                y: Math.random() * 0.5,
                z: Math.random() * 0.5,
                w: 0.8 + Math.random() * 0.2,
              },
              velocity: { x: 0, y: 0, z: 0 },
              angularVelocity: { x: 0, y: 0, z: 0 },
              mass: 5,
              isStatic: false,
            },
            // Torso
            {
              id: `${modelId}_torso`,
              position: {
                x: randomOffset(),
                y: height - headSize - torsoHeight / 2 + randomOffset(),
                z: randomOffset(),
              },
              rotation: {
                x: Math.random() * 0.5,
                y: Math.random() * 0.5,
                z: Math.random() * 0.5,
                w: 0.8 + Math.random() * 0.2,
              },
              velocity: { x: 0, y: 0, z: 0 },
              angularVelocity: { x: 0, y: 0, z: 0 },
              mass: 30,
              isStatic: false,
            },
            // Left arm
            {
              id: `${modelId}_left_arm`,
              position: {
                x: -torsoWidth / 2 - armLength / 2 + randomOffset(),
                y: height - headSize - torsoHeight / 4 + randomOffset(),
                z: randomOffset(),
              },
              rotation: {
                x: Math.random() * 0.5,
                y: Math.random() * 0.5,
                z: Math.random() * 0.5,
                w: 0.8 + Math.random() * 0.2,
              },
              velocity: { x: 0, y: 0, z: 0 },
              angularVelocity: { x: 0, y: 0, z: 0 },
              mass: 8,
              isStatic: false,
            },
            // Right arm
            {
              id: `${modelId}_right_arm`,
              position: {
                x: torsoWidth / 2 + armLength / 2 + randomOffset(),
                y: height - headSize - torsoHeight / 4 + randomOffset(),
                z: randomOffset(),
              },
              rotation: {
                x: Math.random() * 0.5,
                y: Math.random() * 0.5,
                z: Math.random() * 0.5,
                w: 0.8 + Math.random() * 0.2,
              },
              velocity: { x: 0, y: 0, z: 0 },
              angularVelocity: { x: 0, y: 0, z: 0 },
              mass: 8,
              isStatic: false,
            },
            // Left leg
            {
              id: `${modelId}_left_leg`,
              position: {
                x: -torsoWidth / 4 + randomOffset(),
                y: height - headSize - torsoHeight - legLength / 2 + randomOffset(),
                z: randomOffset(),
              },
              rotation: {
                x: Math.random() * 0.5,
                y: Math.random() * 0.5,
                z: Math.random() * 0.5,
                w: 0.8 + Math.random() * 0.2,
              },
              velocity: { x: 0, y: 0, z: 0 },
              angularVelocity: { x: 0, y: 0, z: 0 },
              mass: 15,
              isStatic: false,
            },
            // Right leg
            {
              id: `${modelId}_right_leg`,
              position: {
                x: torsoWidth / 4 + randomOffset(),
                y: height - headSize - torsoHeight - legLength / 2 + randomOffset(),
                z: randomOffset(),
              },
              rotation: {
                x: Math.random() * 0.5,
                y: Math.random() * 0.5,
                z: Math.random() * 0.5,
                w: 0.8 + Math.random() * 0.2,
              },
              velocity: { x: 0, y: 0, z: 0 },
              angularVelocity: { x: 0, y: 0, z: 0 },
              mass: 15,
              isStatic: false,
            },
          ],
          joints: [
            // Neck
            {
              id: `${modelId}_neck`,
              bodyA: `${modelId}_head`,
              bodyB: `${modelId}_torso`,
              anchorA: { x: 0, y: -headSize / 2, z: 0 },
              anchorB: { x: 0, y: torsoHeight / 2, z: 0 },
              limits: { min: { x: -0.5, y: -0.5, z: -0.5 }, max: { x: 0.5, y: 0.5, z: 0.5 } },
              stiffness: 0.8,
              damping: 0.5,
            },
            // Left shoulder
            {
              id: `${modelId}_left_shoulder`,
              bodyA: `${modelId}_torso`,
              bodyB: `${modelId}_left_arm`,
              anchorA: { x: -torsoWidth / 2, y: torsoHeight / 4, z: 0 },
              anchorB: { x: armLength / 2, y: 0, z: 0 },
              limits: { min: { x: -1.0, y: -1.0, z: -1.0 }, max: { x: 1.0, y: 1.0, z: 1.0 } },
              stiffness: 0.6,
              damping: 0.3,
            },
            // Right shoulder
            {
              id: `${modelId}_right_shoulder`,
              bodyA: `${modelId}_torso`,
              bodyB: `${modelId}_right_arm`,
              anchorA: { x: torsoWidth / 2, y: torsoHeight / 4, z: 0 },
              anchorB: { x: -armLength / 2, y: 0, z: 0 },
              limits: { min: { x: -1.0, y: -1.0, z: -1.0 }, max: { x: 1.0, y: 1.0, z: 1.0 } },
              stiffness: 0.6,
              damping: 0.3,
            },
            // Left hip
            {
              id: `${modelId}_left_hip`,
              bodyA: `${modelId}_torso`,
              bodyB: `${modelId}_left_leg`,
              anchorA: { x: -torsoWidth / 4, y: -torsoHeight / 2, z: 0 },
              anchorB: { x: 0, y: legLength / 2, z: 0 },
              limits: { min: { x: -0.8, y: -0.3, z: -0.3 }, max: { x: 0.8, y: 0.3, z: 0.3 } },
              stiffness: 0.7,
              damping: 0.4,
            },
            // Right hip
            {
              id: `${modelId}_right_hip`,
              bodyA: `${modelId}_torso`,
              bodyB: `${modelId}_right_leg`,
              anchorA: { x: torsoWidth / 4, y: -torsoHeight / 2, z: 0 },
              anchorB: { x: 0, y: legLength / 2, z: 0 },
              limits: { min: { x: -0.8, y: -0.3, z: -0.3 }, max: { x: 0.8, y: 0.3, z: 0.3 } },
              stiffness: 0.7,
              damping: 0.4,
            },
          ],
        },
      ],
    }

    setSimulationState(mockState)
  }

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      submitQuery()
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>RAG-Based AI with Physics Simulation</CardTitle>
          <CardDescription>Ask questions about rag doll physics or request physics simulations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about rag doll physics or request a simulation..."
              className="flex-1"
            />
            <Button onClick={submitQuery} disabled={loading}>
              {loading ? "Processing..." : "Submit"}
            </Button>
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-4">{error}</div>}

          {response && (
            <Tabs defaultValue="response" className="mt-4">
              <TabsList>
                <TabsTrigger value="response">Response</TabsTrigger>
                <TabsTrigger value="simulation">Physics Simulation</TabsTrigger>
                <TabsTrigger value="context">Context Documents</TabsTrigger>
              </TabsList>

              <TabsContent value="response" className="mt-4">
                <div className="bg-white border border-gray-200 rounded-md p-4">
                  <p className="whitespace-pre-line">{response.content}</p>
                </div>
              </TabsContent>

              <TabsContent value="simulation" className="mt-4">
                <PhysicsVisualizer simulationState={simulationState} width={600} height={400} />
                {response.physicsSimulation && (
                  <p className="text-sm text-gray-500 mt-2">
                    Model ID: {response.physicsSimulation.modelId}, Simulation time:{" "}
                    {response.physicsSimulation.timeElapsed}s
                  </p>
                )}
              </TabsContent>

              <TabsContent value="context" className="mt-4">
                {response.contextualDocuments && response.contextualDocuments.length > 0 ? (
                  <div className="space-y-4">
                    {response.contextualDocuments.map((doc, index) => (
                      <div key={doc.id} className="bg-gray-50 border border-gray-200 rounded-md p-4">
                        <h4 className="font-medium mb-1">Document {index + 1}</h4>
                        <p>{doc.content}</p>
                        <div className="mt-2 text-xs text-gray-500">
                          Source: {doc.metadata.source}, Category: {doc.metadata.category}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No context documents available</p>
                )}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <div className="text-xs text-gray-500">RAG Physics: {ENV.ENABLE_RAG_PHYSICS ? "Enabled" : "Disabled"}</div>
          <div className="text-xs text-gray-500">
            {response?.timestamp && `Last updated: ${new Date(response.timestamp).toLocaleString()}`}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

