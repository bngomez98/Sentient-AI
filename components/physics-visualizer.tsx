"use client"

import { useEffect, useRef, useState } from "react"
import { ENV } from "@/lib/env-variables"

interface Vector3 {
  x: number
  y: number
  z: number
}

interface Quaternion {
  x: number
  y: number
  z: number
  w: number
}

interface RigidBody {
  id: string
  position: Vector3
  rotation: Quaternion
  velocity: Vector3
  angularVelocity: Vector3
  mass: number
  isStatic: boolean
}

interface Joint {
  id: string
  bodyA: string
  bodyB: string
  anchorA: Vector3
  anchorB: Vector3
  limits: {
    min: Vector3
    max: Vector3
  }
  stiffness: number
  damping: number
}

interface RagdollModel {
  id: string
  bodies: RigidBody[]
  joints: Joint[]
}

interface SimulationState {
  time: number
  models: RagdollModel[]
}

interface PhysicsVisualizerProps {
  simulationState?: SimulationState
  width?: number
  height?: number
  backgroundColor?: string
  bodyColor?: string
  jointColor?: string
}

export default function PhysicsVisualizer({
  simulationState,
  width = 600,
  height = 400,
  backgroundColor = "#f0f0f0",
  bodyColor = "#3b82f6",
  jointColor = "#ef4444",
}: PhysicsVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!canvasRef.current || !simulationState) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, width, height)

    // Set up coordinate system (origin at center, y-axis pointing up)
    ctx.save()
    ctx.translate(width / 2, height)
    ctx.scale(100, -100) // Scale to make 1 unit = 100 pixels

    // Draw each model
    for (const model of simulationState.models) {
      // Draw joints first (so they appear behind bodies)
      ctx.strokeStyle = jointColor
      ctx.lineWidth = 0.02

      for (const joint of model.joints) {
        const bodyA = model.bodies.find((b) => b.id === joint.bodyA)
        const bodyB = model.bodies.find((b) => b.id === joint.bodyB)

        if (!bodyA || !bodyB) continue

        // Calculate world positions of anchors (simplified)
        const worldAnchorA = {
          x: bodyA.position.x + joint.anchorA.x,
          y: bodyA.position.y + joint.anchorA.y,
          z: bodyA.position.z + joint.anchorA.z,
        }

        const worldAnchorB = {
          x: bodyB.position.x + joint.anchorB.x,
          y: bodyB.position.y + joint.anchorB.y,
          z: bodyB.position.z + joint.anchorB.z,
        }

        // Draw line between anchors
        ctx.beginPath()
        ctx.moveTo(worldAnchorA.x, worldAnchorA.y)
        ctx.lineTo(worldAnchorB.x, worldAnchorB.y)
        ctx.stroke()
      }

      // Draw bodies
      ctx.fillStyle = bodyColor

      for (const body of model.bodies) {
        // Draw a circle for each body
        const radius = Math.sqrt(body.mass) * 0.05

        ctx.beginPath()
        ctx.arc(body.position.x, body.position.y, radius, 0, Math.PI * 2)
        ctx.fill()

        // Draw a line indicating rotation
        const rotX = Math.sin(Math.atan2(body.rotation.z, body.rotation.w) * 2) * radius
        const rotY = Math.cos(Math.atan2(body.rotation.z, body.rotation.w) * 2) * radius

        ctx.beginPath()
        ctx.moveTo(body.position.x, body.position.y)
        ctx.lineTo(body.position.x + rotX, body.position.y + rotY)
        ctx.stroke()
      }
    }

    // Draw ground
    ctx.strokeStyle = "#000000"
    ctx.lineWidth = 0.01
    ctx.beginPath()
    ctx.moveTo(-3, 0)
    ctx.lineTo(3, 0)
    ctx.stroke()

    // Restore context
    ctx.restore()

    // Draw simulation time
    ctx.fillStyle = "#000000"
    ctx.font = "14px Arial"
    ctx.fillText(`Time: ${simulationState.time.toFixed(2)}s`, 10, 20)
  }, [simulationState, width, height, backgroundColor, bodyColor, jointColor])

  if (!isClient) {
    return <div>Loading physics visualizer...</div>
  }

  return (
    <div className="relative border border-gray-300 rounded-lg overflow-hidden">
      <canvas ref={canvasRef} width={width} height={height} className="w-full h-auto" />
      {!simulationState && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-80">
          <p className="text-gray-500">No simulation data available</p>
        </div>
      )}
      {!ENV.ENABLE_RAG_PHYSICS && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-80">
          <p className="text-gray-500">Physics simulation is disabled. Enable with ENABLE_RAG_PHYSICS=true</p>
        </div>
      )}
    </div>
  )
}
