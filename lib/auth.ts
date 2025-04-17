import { logger } from "./logger"

// Types
// export interface User {
//   id: string
//   username: string
//   email: string
//   passwordHash: string
//   createdAt: Date
//   lastLoginAt?: Date
//   settings?: UserSettings
// }

// export interface UserSettings {
//   theme?: "light" | "dark" | "system"
//   showReasoningProcess?: boolean
//   temperature?: number
//   systemPrompt?: string
//   contextMemorySize?: number
// }

// export interface AuthResult {
//   success: boolean
//   message: string
//   token?: string
//   user?: Omit<User, "passwordHash">
// }

interface User {
  id: string
  email: string
  name?: string
  settings?: {
    temperature?: number
    systemPrompt?: string
    showReasoningProcess?: boolean
    contextMemorySize?: number
  }
}

// In-memory user database for simplicity
const users = new Map<string, User>()

// User authentication service
// class AuthService {
//   /**
//    * Register a new user
//    */
//   async register(username: string, email: string, password: string): Promise<AuthResult> {
//     try {
//       // Check if user already exists
//       const existingUser = await db.getUserByEmail(email)
//       if (existingUser) {
//         return { success: false, message: "User with this email already exists" }
//       }

//       // Hash password
//       const passwordHash = await hash(password, 10)

//       // Create user
//       const user: User = {
//         id: crypto.randomUUID(),
//         username,
//         email,
//         passwordHash,
//         createdAt: new Date(),
//         settings: {
//           theme: "system",
//           showReasoningProcess: false,
//           temperature: 0.7,
//           contextMemorySize: 50,
//         },
//       }

//       // Save user to database
//       await db.saveUser(user)

//       // Generate JWT token
//       const token = this.generateToken(user)

//       // Return success
//       return {
//         success: true,
//         message: "User registered successfully",
//         token,
//         user: this.sanitizeUser(user),
//       }
//     } catch (error) {
//       logger.error("Error registering user", error)
//       return { success: false, message: "Registration failed" }
//     }
//   }

//   /**
//    * Login user
//    */
//   async login(email: string, password: string): Promise<AuthResult> {
//     try {
//       // Get user from database
//       const user = await db.getUserByEmail(email)
//       if (!user) {
//         return { success: false, message: "Invalid email or password" }
//       }

//       // Check password
//       const passwordMatch = await compare(password, user.passwordHash)
//       if (!passwordMatch) {
//         return { success: false, message: "Invalid email or password" }
//       }

//       // Update last login
//       user.lastLoginAt = new Date()
//       await db.saveUser(user)

//       // Generate JWT token
//       const token = this.generateToken(user)

//       // Return success
//       return {
//         success: true,
//         message: "Login successful",
//         token,
//         user: this.sanitizeUser(user),
//       }
//     } catch (error) {
//       logger.error("Error logging in user", error)
//       return { success: false, message: "Login failed" }
//     }
//   }

//   /**
//    * Verify JWT token
//    */
//   verifyToken(token: string): { valid: boolean; userId?: string } {
//     try {
//       const decoded = verify(token, config.jwt.secret) as { userId: string }
//       return { valid: true, userId: decoded.userId }
//     } catch (error) {
//       return { valid: false }
//     }
//   }

//   /**
//    * Generate JWT token
//    */
//   private generateToken(user: User): string {
//     return sign({ userId: user.id }, config.jwt.secret, { expiresIn: config.jwt.expiresIn })
//   }

//   /**
//    * Remove sensitive data from user object
//    */
//   private sanitizeUser(user: User): Omit<User, "passwordHash"> {
//     const { passwordHash, ...sanitizedUser } = user
//     return sanitizedUser
//   }

//   /**
//    * Update user settings
//    */
//   async updateUserSettings(userId: string, settings: Partial<UserSettings>): Promise<boolean> {
//     try {
//       const user = await db.getUserById(userId)
//       if (!user) return false

//       user.settings = { ...user.settings, ...settings }
//       await db.saveUser(user)
//       return true
//     } catch (error) {
//       logger.error("Error updating user settings", error)
//       return false
//     }
//   }

//   /**
//    * Get user by ID
//    */
//   async getUserById(userId: string): Promise<Omit<User, "passwordHash"> | null> {
//     try {
//       const user = await db.getUserById(userId)
//       if (!user) return null
//       return this.sanitizeUser(user)
//     } catch (error) {
//       logger.error("Error getting user by ID", error)
//       return null
//     }
//   }
// }

// Export singleton instance
// export const auth = new AuthService()

export const auth = {
  verifyToken: (token: string): { valid: boolean; userId?: string } => {
    try {
      // Simple token validation for demo purposes
      if (token && token.length > 10) {
        const parts = token.split(".")
        if (parts.length === 3) {
          try {
            const payload = JSON.parse(atob(parts[1]))
            if (payload && payload.userId) {
              return { valid: true, userId: payload.userId }
            }
          } catch (e) {
            logger.error("Error parsing token", e)
          }
        }
      }
      return { valid: false }
    } catch (error) {
      logger.error("Error verifying token", error)
      return { valid: false }
    }
  },

  getUserById: async (userId: string): Promise<User | null> => {
    try {
      return users.get(userId) || null
    } catch (error) {
      logger.error("Error getting user", error)
      return null
    }
  },
}

