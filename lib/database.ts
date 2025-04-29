import { logger } from "./logger"

interface Message {
  role: string
  content: string
  timestamp: Date
  contextualSignal?: any
}

interface Conversation {
  sessionId: string
  userId?: string
  messages: Message[]
  metadata: {
    createdAt: Date
    updatedAt: Date
  }
}

// In-memory database for simplicity
const conversations = new Map<string, Conversation>()

export const db = {
  getConversation: async (sessionId: string): Promise<Conversation | null> => {
    try {
      return conversations.get(sessionId) || null
    } catch (error) {
      logger.error("Error getting conversation", error)
      return null
    }
  },

  saveConversation: async (conversation: Conversation): Promise<void> => {
    try {
      conversations.set(conversation.sessionId, conversation)
    } catch (error) {
      logger.error("Error saving conversation", error)
    }
  },

  deleteConversation: async (sessionId: string): Promise<void> => {
    try {
      conversations.delete(sessionId)
    } catch (error) {
      logger.error("Error deleting conversation", error)
    }
  },

  listConversations: async (userId?: string): Promise<Conversation[]> => {
    try {
      const allConversations = Array.from(conversations.values())
      if (userId) {
        return allConversations.filter((conv) => conv.userId === userId)
      }
      return allConversations
    } catch (error) {
      logger.error("Error listing conversations", error)
      return []
    }
  },
}
