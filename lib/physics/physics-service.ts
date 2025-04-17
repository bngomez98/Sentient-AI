import { ENV } from "../env-variables"
import { logger } from "../logger"

export interface Vector3 {
  x: number
  y: number
  z: number
}

export interface Quaternion {
  x: number
  y: number
  z: number
  w: number
}

export interface RigidBody {
  id: string
  position: Vector3
  rotation: Quaternion
  velocity: Vector3
  angularVelocity: Vector3
  mass: number
  isStatic: boolean
  dimensions?: Vector3 // For visualization
  type: "box" | "sphere" | "capsule"
  color?: string
}

export interface Joint {
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

export interface RagdollModel {
  id: string
  bodies: RigidBody[]
  joints: Joint[]
}

export interface SimulationState {
  time: number
  models: RagdollModel[]
}

export interface SimulationResult {
  initialState: SimulationState
  finalState: SimulationState
  duration: number
  steps: number
}

/**
 * Physics simulation service
 */
class PhysicsService {
  private enabled: boolean
  private gravity: number
  private timeStep: number
  private iterations: number
  private damping: number
  private quality: string

  constructor() {
    this.enabled = ENV.ENABLE_RAG_PHYSICS
    this.gravity = ENV.PHYSICS_GRAVITY
    this.timeStep = ENV.PHYSICS_TIMESTEP
    this.iterations = ENV.PHYSICS_ITERATIONS
    this.damping = ENV.PHYSICS_DAMPING
    this.quality = ENV.PHYSICS_SIMULATION_QUALITY

    logger.info("Physics Service initialized", {
      enabled: this.enabled,
      gravity: this.gravity,
      timeStep: this.timeStep,
      iterations: this.iterations,
      quality: this.quality,
    })
  }

  /**
   * Create a human ragdoll model
   */
  createHumanRagdoll(id: string, height = 1.8, mass = 70): RagdollModel {
    // Scale factors based on height
    const headRadius = height * 0.075
    const torsoHeight = height * 0.3
    const torsoWidth = height * 0.2
    const torsoDepth = height * 0.1
    const upperArmLength = height * 0.15
    const lowerArmLength = height * 0.15
    const upperLegLength = height * 0.22
    const lowerLegLength = height * 0.22
    const limbRadius = height * 0.025

    // Create a basic humanoid ragdoll
    const model: RagdollModel = {
      id,
      bodies: [
        // Head
        {
          id: `${id}_head`,
          position: { x: 0, y: height - headRadius, z: 0 },
          rotation: { x: 0, y: 0, z: 0, w: 1 },
          velocity: { x: 0, y: 0, z: 0 },
          angularVelocity: { x: 0, y: 0, z: 0 },
          mass: mass * 0.08,
          isStatic: false,
          dimensions: { x: headRadius * 2, y: headRadius * 2, z: headRadius * 2 },
          type: "sphere",
          color: "#FFD700", // Gold for head
        },
        // Torso
        {
          id: `${id}_torso`,
          position: { x: 0, y: height - headRadius * 2 - torsoHeight / 2, z: 0 },
          rotation: { x: 0, y: 0, z: 0, w: 1 },
          velocity: { x: 0, y: 0, z: 0 },
          angularVelocity: { x: 0, y: 0, z: 0 },
          mass: mass * 0.43,
          isStatic: false,
          dimensions: { x: torsoWidth, y: torsoHeight, z: torsoDepth },
          type: "box",
          color: "#4169E1", // Royal Blue for torso
        },
        // Left upper arm
        {
          id: `${id}_left_upper_arm`,
          position: { x: -torsoWidth / 2 - upperArmLength / 2, y: height - headRadius * 2 - torsoHeight / 4, z: 0 },
          rotation: { x: 0, y: 0, z: 0, w: 1 },
          velocity: { x: 0, y: 0, z: 0 },
          angularVelocity: { x: 0, y: 0, z: 0 },
          mass: mass * 0.05,
          isStatic: false,
          dimensions: { x: upperArmLength, y: limbRadius * 2, z: limbRadius * 2 },
          type: "capsule",
          color: "#3CB371", // Medium Sea Green for arms
        },
        // Left lower arm
        {
          id: `${id}_left_lower_arm`,
          position: {
            x: -torsoWidth / 2 - upperArmLength - lowerArmLength / 2,
            y: height - headRadius * 2 - torsoHeight / 4,
            z: 0,
          },
          rotation: { x: 0, y: 0, z: 0, w: 1 },
          velocity: { x: 0, y: 0, z: 0 },
          angularVelocity: { x: 0, y: 0, z: 0 },
          mass: mass * 0.04,
          isStatic: false,
          dimensions: { x: lowerArmLength, y: limbRadius * 1.8, z: limbRadius * 1.8 },
          type: "capsule",
          color: "#3CB371", // Medium Sea Green for arms
        },
        // Right upper arm
        {
          id: `${id}_right_upper_arm`,
          position: { x: torsoWidth / 2 + upperArmLength / 2, y: height - headRadius * 2 - torsoHeight / 4, z: 0 },
          rotation: { x: 0, y: 0, z: 0, w: 1 },
          velocity: { x: 0, y: 0, z: 0 },
          angularVelocity: { x: 0, y: 0, z: 0 },
          mass: mass * 0.05,
          isStatic: false,
          dimensions: { x: upperArmLength, y: limbRadius * 2, z: limbRadius * 2 },
          type: "capsule",
          color: "#3CB371", // Medium Sea Green for arms
        },
        // Right lower arm
        {
          id: `${id}_right_lower_arm`,
          position: {
            x: torsoWidth / 2 + upperArmLength + lowerArmLength / 2,
            y: height - headRadius * 2 - torsoHeight / 4,
            z: 0,
          },
          rotation: { x: 0, y: 0, z: 0, w: 1 },
          velocity: { x: 0, y: 0, z: 0 },
          angularVelocity: { x: 0, y: 0, z: 0 },
          mass: mass * 0.04,
          isStatic: false,
          dimensions: { x: lowerArmLength, y: limbRadius * 1.8, z: limbRadius * 1.8 },
          type: "capsule",
          color: "#3CB371", // Medium Sea Green for arms
        },
        // Left upper leg
        {
          id: `${id}_left_upper_leg`,
          position: { x: -torsoWidth / 4, y: height - headRadius * 2 - torsoHeight - upperLegLength / 2, z: 0 },
          rotation: { x: 0, y: 0, z: 0, w: 1 },
          velocity: { x: 0, y: 0, z: 0 },
          angularVelocity: { x: 0, y: 0, z: 0 },
          mass: mass * 0.1,
          isStatic: false,
          dimensions: { x: upperLegLength, y: limbRadius * 2.2, z: limbRadius * 2.2 },
          type: "capsule",
          color: "#CD853F", // Peru for legs
        },
        // Left lower leg
        {
          id: `${id}_left_lower_leg`,
          position: {
            x: -torsoWidth / 4,
            y: height - headRadius * 2 - torsoHeight - upperLegLength - lowerLegLength / 2,
            z: 0,
          },
          rotation: { x: 0, y: 0, z: 0, w: 1 },
          velocity: { x: 0, y: 0, z: 0 },
          angularVelocity: { x: 0, y: 0, z: 0 },
          mass: mass * 0.06,
          isStatic: false,
          dimensions: { x: lowerLegLength, y: limbRadius * 2, z: limbRadius * 2 },
          type: "capsule",
          color: "#CD853F", // Peru for legs
        },
        // Right upper leg
        {
          id: `${id}_right_upper_leg`,
          position: { x: torsoWidth / 4, y: height - headRadius * 2 - torsoHeight - upperLegLength / 2, z: 0 },
          rotation: { x: 0, y: 0, z: 0, w: 1 },
          velocity: { x: 0, y: 0, z: 0 },
          angularVelocity: { x: 0, y: 0, z: 0 },
          mass: mass * 0.1,
          isStatic: false,
          dimensions: { x: upperLegLength, y: limbRadius * 2.2, z: limbRadius * 2.2 },
          type: "capsule",
          color: "#CD853F", // Peru for legs
        },
        // Right lower leg
        {
          id: `${id}_right_lower_leg`,
          position: {
            x: torsoWidth / 4,
            y: height - headRadius * 2 - torsoHeight - upperLegLength - lowerLegLength / 2,
            z: 0,
          },
          rotation: { x: 0, y: 0, z: 0, w: 1 },
          velocity: { x: 0, y: 0, z: 0 },
          angularVelocity: { x: 0, y: 0, z: 0 },
          mass: mass * 0.06,
          isStatic: false,
          dimensions: { x: lowerLegLength, y: limbRadius * 2, z: limbRadius * 2 },
          type: "capsule",
          color: "#CD853F", // Peru for legs
        },
      ],
      joints: [
        // Neck joint (head to torso)
        {
          id: `${id}_neck`,
          bodyA: `${id}_head`,
          bodyB: `${id}_torso`,
          anchorA: { x: 0, y: -headRadius, z: 0 },
          anchorB: { x: 0, y: torsoHeight / 2, z: 0 },
          limits: {
            min: { x: -0.5, y: -0.5, z: -0.5 },
            max: { x: 0.5, y: 0.5, z: 0.5 },
          },
          stiffness: 0.8,
          damping: 0.5,
        },
        // Left shoulder joint
        {
          id: `${id}_left_shoulder`,
          bodyA: `${id}_torso`,
          bodyB: `${id}_left_upper_arm`,
          anchorA: { x: -torsoWidth / 2, y: torsoHeight / 4, z: 0 },
          anchorB: { x: upperArmLength / 2, y: 0, z: 0 },
          limits: {
            min: { x: -1.0, y: -1.0, z: -1.0 },
            max: { x: 1.0, y: 1.0, z: 1.0 },
          },
          stiffness: 0.6,
          damping: 0.3,
        },
        // Left elbow joint
        {
          id: `${id}_left_elbow`,
          bodyA: `${id}_left_upper_arm`,
          bodyB: `${id}_left_lower_arm`,
          anchorA: { x: -upperArmLength / 2, y: 0, z: 0 },
          anchorB: { x: lowerArmLength / 2, y: 0, z: 0 },
          limits: {
            min: { x: 0, y: -0.1, z: -0.1 },
            max: { x: 2.0, y: 0.1, z: 0.1 },
          },
          stiffness: 0.7,
          damping: 0.4,
        },
        // Right shoulder joint
        {
          id: `${id}_right_shoulder`,
          bodyA: `${id}_torso`,
          bodyB: `${id}_right_upper_arm`,
          anchorA: { x: torsoWidth / 2, y: torsoHeight / 4, z: 0 },
          anchorB: { x: -upperArmLength / 2, y: 0, z: 0 },
          limits: {
            min: { x: -1.0, y: -1.0, z: -1.0 },
            max: { x: 1.0, y: 1.0, z: 1.0 },
          },
          stiffness: 0.6,
          damping: 0.3,
        },
        // Right elbow joint
        {
          id: `${id}_right_elbow`,
          bodyA: `${id}_right_upper_arm`,
          bodyB: `${id}_right_lower_arm`,
          anchorA: { x: upperArmLength / 2, y: 0, z: 0 },
          anchorB: { x: -lowerArmLength / 2, y: 0, z: 0 },
          limits: {
            min: { x: -2.0, y: -0.1, z: -0.1 },
            max: { x: 0, y: 0.1, z: 0.1 },
          },
          stiffness: 0.7,
          damping: 0.4,
        },
        // Left hip joint
        {
          id: `${id}_left_hip`,
          bodyA: `${id}_torso`,
          bodyB: `${id}_left_upper_leg`,
          anchorA: { x: -torsoWidth / 4, y: -torsoHeight / 2, z: 0 },
          anchorB: { x: 0, y: upperLegLength / 2, z: 0 },
          limits: {
            min: { x: -0.8, y: -0.3, z: -0.3 },
            max: { x: 0.8, y: 0.3, z: 0.3 },
          },
          stiffness: 0.7,
          damping: 0.4,
        },
        // Left knee joint
        {
          id: `${id}_left_knee`,
          bodyA: `${id}_left_upper_leg`,
          bodyB: `${id}_left_lower_leg`,
          anchorA: { x: 0, y: -upperLegLength / 2, z: 0 },
          anchorB: { x: 0, y: lowerLegLength / 2, z: 0 },
          limits: {
            min: { x: 0, y: -0.1, z: -0.1 },
            max: { x: 1.5, y: 0.1, z: 0.1 },
          },
          stiffness: 0.8,
          damping: 0.4,
        },
        // Right hip joint
        {
          id: `${id}_right_hip`,
          bodyA: `${id}_torso`,
          bodyB: `${id}_right_upper_leg`,
          anchorA: { x: torsoWidth / 4, y: -torsoHeight / 2, z: 0 },
          anchorB: { x: 0, y: upperLegLength / 2, z: 0 },
          limits: {
            min: { x: -0.8, y: -0.3, z: -0.3 },
            max: { x: 0.8, y: 0.3, z: 0.3 },
          },
          stiffness: 0.7,
          damping: 0.4,
        },
        // Right knee joint
        {
          id: `${id}_right_knee`,
          bodyA: `${id}_right_upper_leg`,
          bodyB: `${id}_right_lower_leg`,
          anchorA: { x: 0, y: -upperLegLength / 2, z: 0 },
          anchorB: { x: 0, y: lowerLegLength / 2, z: 0 },
          limits: {
            min: { x: 0, y: -0.1, z: -0.1 },
            max: { x: 1.5, y: 0.1, z: 0.1 },
          },
          stiffness: 0.8,
          damping: 0.4,
        },
      ],
    }

    return model
  }

  /**
   * Run a physics simulation
   */
  simulate(
    model: RagdollModel,
    duration = 3.0,
    forces: Array<{ bodyId: string; force: Vector3; point?: Vector3 }> = [],
  ): SimulationResult {
    if (!this.enabled) {
      logger.warn("Physics simulation is disabled")
      return {
        initialState: { time: 0, models: [model] },
        finalState: { time: 0, models: [model] },
        duration: 0,
        steps: 0,
      }
    }

    // Clone the model to avoid modifying the original
    const initialState: SimulationState = {
      time: 0,
      models: [JSON.parse(JSON.stringify(model))],
    }

    // Create a working copy
    const workingState: SimulationState = JSON.parse(JSON.stringify(initialState))

    // Apply initial forces
    for (const { bodyId, force, point } of forces) {
      this.applyForce(workingState, bodyId, force, point)
    }

    // Calculate number of steps
    const steps = Math.ceil(duration / this.timeStep)
    logger.info(`Running simulation for ${duration}s (${steps} steps)`)

    // Run simulation
    for (let i = 0; i < steps; i++) {
      this.step(workingState)
    }

    return {
      initialState,
      finalState: workingState,
      duration,
      steps,
    }
  }

  /**
   * Step the simulation forward
   */
  private step(state: SimulationState): void {
    // Update simulation time
    state.time += this.timeStep

    // Process each model
    for (const model of state.models) {
      // Apply gravity and update velocities
      for (const body of model.bodies) {
        if (body.isStatic) continue

        // Apply gravity
        body.velocity.y -= this.gravity * this.timeStep

        // Apply damping
        body.velocity.x *= 1 - this.damping
        body.velocity.y *= 1 - this.damping
        body.velocity.z *= 1 - this.damping
        body.angularVelocity.x *= 1 - this.damping
        body.angularVelocity.y *= 1 - this.damping
        body.angularVelocity.z *= 1 - this.damping

        // Update position
        body.position.x += body.velocity.x * this.timeStep
        body.position.y += body.velocity.y * this.timeStep
        body.position.z += body.velocity.z * this.timeStep

        // Simple ground collision
        if (body.position.y < 0) {
          body.position.y = 0
          body.velocity.y = -body.velocity.y * 0.3 // Bounce with energy loss
          body.velocity.x *= 0.8 // Friction
          body.velocity.z *= 0.8 // Friction
        }

        // Update rotation (simplified)
        const rotX = body.angularVelocity.x * this.timeStep
        const rotY = body.angularVelocity.y * this.timeStep
        const rotZ = body.angularVelocity.z * this.timeStep
        const magnitude = Math.sqrt(rotX * rotX + rotY * rotY + rotZ * rotZ)

        if (magnitude > 0.0001) {
          const qx = (rotX / magnitude) * Math.sin(magnitude / 2)
          const qy = (rotY / magnitude) * Math.sin(magnitude / 2)
          const qz = (rotZ / magnitude) * Math.sin(magnitude / 2)
          const qw = Math.cos(magnitude / 2)

          // Quaternion multiplication (current * rotation)
          const nw = body.rotation.w * qw - body.rotation.x * qx - body.rotation.y * qy - body.rotation.z * qz
          const nx = body.rotation.w * qx + body.rotation.x * qw + body.rotation.y * qz - body.rotation.z * qy
          const ny = body.rotation.w * qy - body.rotation.x * qz + body.rotation.y * qw + body.rotation.z * qx
          const nz = body.rotation.w * qz + body.rotation.x * qy - body.rotation.y * qx + body.rotation.z * qw

          body.rotation.x = nx
          body.rotation.y = ny
          body.rotation.z = nz
          body.rotation.w = nw

          // Normalize quaternion
          const len = Math.sqrt(nw * nw + nx * nx + ny * ny + nz * nz)
          body.rotation.x /= len
          body.rotation.y /= len
          body.rotation.z /= len
          body.rotation.w /= len
        }
      }

      // Solve constraints (joints)
      for (let i = 0; i < this.iterations; i++) {
        for (const joint of model.joints) {
          const bodyA = model.bodies.find((b) => b.id === joint.bodyA)
          const bodyB = model.bodies.find((b) => b.id === joint.bodyB)

          if (!bodyA || !bodyB) continue

          // Skip if both bodies are static
          if (bodyA.isStatic && bodyB.isStatic) continue

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

          // Calculate distance between anchors
          const dx = worldAnchorB.x - worldAnchorA.x
          const dy = worldAnchorB.y - worldAnchorA.y
          const dz = worldAnchorB.z - worldAnchorA.z
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)

          // Skip if distance is zero
          if (distance < 0.0001) continue

          // Calculate direction
          const nx = dx / distance
          const ny = dy / distance
          const nz = dz / distance

          // Calculate correction factor
          const massFactorA = bodyA.isStatic ? 0 : 1 / bodyA.mass
          const massFactorB = bodyB.isStatic ? 0 : 1 / bodyB.mass
          const massSum = massFactorA + massFactorB

          if (massSum < 0.00001) continue

          // Apply position correction
          const correction = (((distance - 0.1) * 0.2) / massSum) * joint.stiffness

          if (!bodyA.isStatic) {
            bodyA.position.x += nx * correction * massFactorA
            bodyA.position.y += ny * correction * massFactorA
            bodyA.position.z += nz * correction * massFactorA
          }

          if (!bodyB.isStatic) {
            bodyB.position.x -= nx * correction * massFactorB
            bodyB.position.y -= ny * correction * massFactorB
            bodyB.position.z -= nz * correction * massFactorB
          }
        }
      }
    }
  }

  /**
   * Apply a force to a body
   */
  private applyForce(state: SimulationState, bodyId: string, force: Vector3, point?: Vector3): boolean {
    // Find the body
    let targetBody: RigidBody | undefined
    for (const model of state.models) {
      targetBody = model.bodies.find((body) => body.id === bodyId)
      if (targetBody) break
    }

    if (!targetBody) {
      logger.warn(`Body with ID ${bodyId} not found`)
      return false
    }

    // Apply force
    const massReciprocal = 1 / targetBody.mass
    targetBody.velocity.x += force.x * massReciprocal
    targetBody.velocity.y += force.y * massReciprocal
    targetBody.velocity.z += force.z * massReciprocal

    // If point is specified, calculate torque and apply angular velocity
    if (point) {
      // Simplified torque calculation
      const rx = point.x - targetBody.position.x
      const ry = point.y - targetBody.position.y
      const rz = point.z - targetBody.position.z

      const torqueX = (ry * force.z - rz * force.y) * massReciprocal
      const torqueY = (rz * force.x - rx * force.z) * massReciprocal
      const torqueZ = (rx * force.y - ry * force.x) * massReciprocal

      targetBody.angularVelocity.x += torqueX
      targetBody.angularVelocity.y += torqueY
      targetBody.angularVelocity.z += torqueZ
    }

    return true
  }

  /**
   * Create a simulation based on a query
   */
  createSimulationFromQuery(query: string): {
    model: RagdollModel
    forces: Array<{ bodyId: string; force: Vector3; point?: Vector3 }>
  } {
    // Create a ragdoll model
    const modelId = `model_${Date.now()}`
    const model = this.createHumanRagdoll(modelId)

    // Parse the query to determine forces
    const forces: Array<{ bodyId: string; force: Vector3; point?: Vector3 }> = []
    const lowerQuery = query.toLowerCase()

    // Apply different forces based on query content
    if (lowerQuery.includes("fall") || lowerQuery.includes("gravity")) {
      // Just let gravity do its work
      logger.info("Creating gravity-based simulation")
    } else if (lowerQuery.includes("push") || lowerQuery.includes("force")) {
      // Apply a push force to the torso
      forces.push({
        bodyId: `${modelId}_torso`,
        force: { x: 500 * (Math.random() - 0.5), y: 0, z: 500 * (Math.random() - 0.5) },
      })
      logger.info("Created push force simulation")
    } else if (lowerQuery.includes("jump")) {
      // Apply upward force to legs
      forces.push({
        bodyId: `${modelId}_left_upper_leg`,
        force: { x: 0, y: 1000, z: 0 },
      })
      forces.push({
        bodyId: `${modelId}_right_upper_leg`,
        force: { x: 0, y: 1000, z: 0 },
      })
      logger.info("Created jump simulation")
    } else if (lowerQuery.includes("spin") || lowerQuery.includes("rotate")) {
      // Apply rotational force to torso
      forces.push({
        bodyId: `${modelId}_torso`,
        force: { x: 0, y: 0, z: 1000 },
        point: { x: model.bodies[1].position.x + 0.5, y: model.bodies[1].position.y, z: model.bodies[1].position.z },
      })
      logger.info("Created spin simulation")
    } else if (lowerQuery.includes("punch") || lowerQuery.includes("hit")) {
      // Apply force to head
      forces.push({
        bodyId: `${modelId}_head`,
        force: { x: 800 * (Math.random() - 0.5), y: 200, z: 800 * (Math.random() - 0.5) },
      })
      logger.info("Created punch simulation")
    } else {
      // Default: apply random forces to random body parts
      const bodyParts = ["head", "torso", "left_upper_arm", "right_upper_arm"]
      const selectedPart = bodyParts[Math.floor(Math.random() * bodyParts.length)]

      forces.push({
        bodyId: `${modelId}_${selectedPart}`,
        force: {
          x: 300 * (Math.random() - 0.5),
          y: 300 * Math.random(),
          z: 300 * (Math.random() - 0.5),
        },
      })
      logger.info(`Created random force simulation on ${selectedPart}`)
    }

    return { model, forces }
  }
}

// Export singleton instance
export const physicsService = new PhysicsService()

