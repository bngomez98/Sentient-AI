import { logger } from "./logger"
import { ENV } from "./env-variables"

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

/**
 * Physics simulation service for rag doll physics
 */
class PhysicsSimulationService {
  private gravity: number
  private timeStep: number
  private iterations: number
  private damping: number
  private quality: string
  private enabled: boolean
  private simulationState: SimulationState

  constructor() {
    this.gravity = ENV.PHYSICS_GRAVITY
    this.timeStep = ENV.PHYSICS_TIMESTEP
    this.iterations = ENV.PHYSICS_ITERATIONS
    this.damping = ENV.PHYSICS_DAMPING
    this.quality = ENV.PHYSICS_SIMULATION_QUALITY
    this.enabled = ENV.ENABLE_RAG_PHYSICS

    // Initialize empty simulation state
    this.simulationState = {
      time: 0,
      models: [],
    }

    logger.info("Physics Simulation Service initialized", {
      enabled: this.enabled,
      gravity: this.gravity,
      timeStep: this.timeStep,
      iterations: this.iterations,
      quality: this.quality,
    })
  }

  /**
   * Create a new ragdoll model
   */
  createRagdollModel(id: string, height = 1.8, mass = 70): RagdollModel {
    // Scale factors based on height
    const headSize = height * 0.15
    const torsoHeight = height * 0.3
    const torsoWidth = height * 0.2
    const armLength = height * 0.3
    const legLength = height * 0.45
    const limbRadius = height * 0.05

    // Create a basic humanoid ragdoll
    const model: RagdollModel = {
      id,
      bodies: [
        // Head
        {
          id: `${id}_head`,
          position: { x: 0, y: height - headSize / 2, z: 0 },
          rotation: { x: 0, y: 0, z: 0, w: 1 },
          velocity: { x: 0, y: 0, z: 0 },
          angularVelocity: { x: 0, y: 0, z: 0 },
          mass: mass * 0.08,
          isStatic: false,
        },
        // Torso
        {
          id: `${id}_torso`,
          position: { x: 0, y: height - headSize - torsoHeight / 2, z: 0 },
          rotation: { x: 0, y: 0, z: 0, w: 1 },
          velocity: { x: 0, y: 0, z: 0 },
          angularVelocity: { x: 0, y: 0, z: 0 },
          mass: mass * 0.43,
          isStatic: false,
        },
        // Left upper arm
        {
          id: `${id}_left_upper_arm`,
          position: { x: -torsoWidth / 2 - armLength / 4, y: height - headSize - torsoHeight / 4, z: 0 },
          rotation: { x: 0, y: 0, z: 0, w: 1 },
          velocity: { x: 0, y: 0, z: 0 },
          angularVelocity: { x: 0, y: 0, z: 0 },
          mass: mass * 0.05,
          isStatic: false,
        },
        // Left lower arm
        {
          id: `${id}_left_lower_arm`,
          position: { x: -torsoWidth / 2 - (armLength * 3) / 4, y: height - headSize - torsoHeight / 4, z: 0 },
          rotation: { x: 0, y: 0, z: 0, w: 1 },
          velocity: { x: 0, y: 0, z: 0 },
          angularVelocity: { x: 0, y: 0, z: 0 },
          mass: mass * 0.04,
          isStatic: false,
        },
        // Right upper arm
        {
          id: `${id}_right_upper_arm`,
          position: { x: torsoWidth / 2 + armLength / 4, y: height - headSize - torsoHeight / 4, z: 0 },
          rotation: { x: 0, y: 0, z: 0, w: 1 },
          velocity: { x: 0, y: 0, z: 0 },
          angularVelocity: { x: 0, y: 0, z: 0 },
          mass: mass * 0.05,
          isStatic: false,
        },
        // Right lower arm
        {
          id: `${id}_right_lower_arm`,
          position: { x: torsoWidth / 2 + (armLength * 3) / 4, y: height - headSize - torsoHeight / 4, z: 0 },
          rotation: { x: 0, y: 0, z: 0, w: 1 },
          velocity: { x: 0, y: 0, z: 0 },
          angularVelocity: { x: 0, y: 0, z: 0 },
          mass: mass * 0.04,
          isStatic: false,
        },
        // Left upper leg
        {
          id: `${id}_left_upper_leg`,
          position: { x: -torsoWidth / 4, y: height - headSize - torsoHeight - legLength / 4, z: 0 },
          rotation: { x: 0, y: 0, z: 0, w: 1 },
          velocity: { x: 0, y: 0, z: 0 },
          angularVelocity: { x: 0, y: 0, z: 0 },
          mass: mass * 0.1,
          isStatic: false,
        },
        // Left lower leg
        {
          id: `${id}_left_lower_leg`,
          position: { x: -torsoWidth / 4, y: height - headSize - torsoHeight - (legLength * 3) / 4, z: 0 },
          rotation: { x: 0, y: 0, z: 0, w: 1 },
          velocity: { x: 0, y: 0, z: 0 },
          angularVelocity: { x: 0, y: 0, z: 0 },
          mass: mass * 0.06,
          isStatic: false,
        },
        // Right upper leg
        {
          id: `${id}_right_upper_leg`,
          position: { x: torsoWidth / 4, y: height - headSize - torsoHeight - legLength / 4, z: 0 },
          rotation: { x: 0, y: 0, z: 0, w: 1 },
          velocity: { x: 0, y: 0, z: 0 },
          angularVelocity: { x: 0, y: 0, z: 0 },
          mass: mass * 0.1,
          isStatic: false,
        },
        // Right lower leg
        {
          id: `${id}_right_lower_leg`,
          position: { x: torsoWidth / 4, y: height - headSize - torsoHeight - (legLength * 3) / 4, z: 0 },
          rotation: { x: 0, y: 0, z: 0, w: 1 },
          velocity: { x: 0, y: 0, z: 0 },
          angularVelocity: { x: 0, y: 0, z: 0 },
          mass: mass * 0.06,
          isStatic: false,
        },
      ],
      joints: [
        // Neck joint (head to torso)
        {
          id: `${id}_neck`,
          bodyA: `${id}_head`,
          bodyB: `${id}_torso`,
          anchorA: { x: 0, y: -headSize / 2, z: 0 },
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
          anchorB: { x: armLength / 4, y: 0, z: 0 },
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
          anchorA: { x: -armLength / 4, y: 0, z: 0 },
          anchorB: { x: armLength / 4, y: 0, z: 0 },
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
          anchorB: { x: -armLength / 4, y: 0, z: 0 },
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
          anchorA: { x: armLength / 4, y: 0, z: 0 },
          anchorB: { x: -armLength / 4, y: 0, z: 0 },
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
          anchorB: { x: 0, y: legLength / 4, z: 0 },
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
          anchorA: { x: 0, y: -legLength / 4, z: 0 },
          anchorB: { x: 0, y: legLength / 4, z: 0 },
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
          anchorB: { x: 0, y: legLength / 4, z: 0 },
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
          anchorA: { x: 0, y: -legLength / 4, z: 0 },
          anchorB: { x: 0, y: legLength / 4, z: 0 },
          limits: {
            min: { x: 0, y: -0.1, z: -0.1 },
            max: { x: 1.5, y: 0.1, z: 0.1 },
          },
          stiffness: 0.8,
          damping: 0.4,
        },
      ],
    }

    // Add the model to the simulation
    this.simulationState.models.push(model)

    return model
  }

  /**
   * Apply a force to a specific body
   */
  applyForce(bodyId: string, force: Vector3, point?: Vector3): boolean {
    if (!this.enabled) {
      logger.warn("Physics simulation is disabled")
      return false
    }

    // Find the body
    let targetBody: RigidBody | undefined
    for (const model of this.simulationState.models) {
      targetBody = model.bodies.find((body) => body.id === bodyId)
      if (targetBody) break
    }

    if (!targetBody) {
      logger.warn(`Body with ID ${bodyId} not found`)
      return false
    }

    // Apply force (in a real physics engine, this would be more complex)
    const massReciprocal = 1 / targetBody.mass
    targetBody.velocity.x += force.x * massReciprocal * this.timeStep
    targetBody.velocity.y += force.y * massReciprocal * this.timeStep
    targetBody.velocity.z += force.z * massReciprocal * this.timeStep

    // If point is specified, calculate torque and apply angular velocity
    if (point) {
      // Simplified torque calculation
      const rx = point.x - targetBody.position.x
      const ry = point.y - targetBody.position.y
      const rz = point.z - targetBody.position.z

      const torqueX = (ry * force.z - rz * force.y) * massReciprocal
      const torqueY = (rz * force.x - rx * force.z) * massReciprocal
      const torqueZ = (rx * force.y - ry * force.x) * massReciprocal

      targetBody.angularVelocity.x += torqueX * this.timeStep
      targetBody.angularVelocity.y += torqueY * this.timeStep
      targetBody.angularVelocity.z += torqueZ * this.timeStep
    }

    return true
  }

  /**
   * Step the simulation forward by the configured time step
   */
  step(): SimulationState {
    if (!this.enabled) {
      return this.simulationState
    }

    // Update simulation time
    this.simulationState.time += this.timeStep

    // Process each model
    for (const model of this.simulationState.models) {
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

          // Apply joint limits (simplified)
          // In a real physics engine, this would be more complex with proper rotational constraints
        }
      }
    }

    return this.simulationState
  }

  /**
   * Run the simulation for a specified duration
   */
  simulate(duration: number): SimulationState {
    if (!this.enabled) {
      logger.warn("Physics simulation is disabled")
      return this.simulationState
    }

    const steps = Math.ceil(duration / this.timeStep)
    logger.info(`Running simulation for ${duration}s (${steps} steps)`)

    for (let i = 0; i < steps; i++) {
      this.step()
    }

    return this.simulationState
  }

  /**
   * Reset the simulation
   */
  reset(): void {
    this.simulationState = {
      time: 0,
      models: [],
    }
    logger.info("Physics simulation reset")
  }

  /**
   * Get the current simulation state
   */
  getState(): SimulationState {
    return this.simulationState
  }
}

// Export singleton instance
export const physicsSimulation = new PhysicsSimulationService()

