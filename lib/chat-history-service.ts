import { kv } from "@vercel/kv"
import { logger } from "./logger"
import type { Message } from "ai"

export interface ChatMessage extends Message {
  timestamp?: string
}

export interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: string
  updatedAt: string
  userId?: string
}

export class ChatHistoryService {
  private static instance: ChatHistoryService

  private constructor() {
    logger.info("ChatHistoryService initialized")
  }

  public static getInstance(): ChatHistoryService {
    if (!ChatHistoryService.instance) {
      ChatHistoryService.instance = new ChatHistoryService()
    }
    return ChatHistoryService.instance
  }

  /**
   * Save a chat session to the KV store
   */
  async saveChat(chatId: string, messages: ChatMessage[], userId?: string): Promise<boolean> {
    try {
      // Generate a title from the first user message
      const firstUserMessage = messages.find((m) => m.role === "user")
      const title = firstUserMessage ? firstUserMessage.content.substring(0, 30) + "..." : "New conversation"

      // Create or update the chat session
      const session: ChatSession = {
        id: chatId,
        title,
        messages,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId,
      }

      // Store in KV with expiration (7 days)
      await kv.set(`chat:${chatId}`, session, { ex: 60 * 60 * 24 * 7 })

      // Also store messages separately for context retrieval
      await kv.set(`chat:${chatId}:messages`, messages, { ex: 60 * 60 * 24 * 7 })

      // If we have a userId, add this chat to their list
      if (userId) {
        await kv.sadd(`user:${userId}:chats`, chatId)
      } else {
        // For anonymous users, store in a general list
        await kv.sadd(`anonymous:chats`, chatId)
      }

      logger.info("Chat saved successfully", { chatId, messageCount: messages.length, userId })
      return true
    } catch (error) {
      logger.error("Error saving chat", { error, chatId })
      return false
    }
  }

  /**
   * Get a chat session from the KV store
   */
  async getChat(chatId: string): Promise<ChatSession | null> {
    try {
      const session = await kv.get<ChatSession>(`chat:${chatId}`)

      if (!session) {
        // Try to reconstruct the session from messages if the session object is missing
        const messages = await kv.get<ChatMessage[]>(`chat:${chatId}:messages`)

        if (messages && messages.length > 0) {
          const firstUserMessage = messages.find((m) => m.role === "user")
          const title = firstUserMessage ? firstUserMessage.content.substring(0, 30) + "..." : "New conversation"

          return {
            id: chatId,
            title,
            messages,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        }

        return null
      }

      return session
    } catch (error) {
      logger.error("Error retrieving chat", { error, chatId })
      return null
    }
  }

  /**
   * List all chats for a user
   */
  async listUserChats(userId: string): Promise<ChatSession[]> {
    try {
      // Get all chat IDs for this user
      const chatIds = await kv.smembers<string>(`user:${userId}:chats`)

      if (!chatIds || chatIds.length === 0) {
        // Try anonymous chats if no user-specific chats found
        const anonymousChatIds = await kv.smembers<string>(`anonymous:chats`)

        if (!anonymousChatIds || anonymousChatIds.length === 0) {
          return []
        }

        // Get all anonymous chat sessions
        const chats: ChatSession[] = []
        for (const chatId of anonymousChatIds) {
          const chat = await this.getChat(chatId)
          if (chat) {
            chats.push(chat)
          }
        }

        // Sort by updatedAt (newest first)
        return chats.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      }

      // Get all chat sessions for the user
      const chats: ChatSession[] = []
      for (const chatId of chatIds) {
        const chat = await this.getChat(chatId)
        if (chat) {
          chats.push(chat)
        }
      }

      // Sort by updatedAt (newest first)
      return chats.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    } catch (error) {
      logger.error("Error listing user chats", { error, userId })
      return []
    }
  }

  /**
   * Delete a chat session
   */
  async deleteChat(chatId: string, userId?: string): Promise<boolean> {
    try {
      // Delete the chat and its messages
      await kv.del(`chat:${chatId}`)
      await kv.del(`chat:${chatId}:messages`)

      // If we have a userId, remove this chat from their list
      if (userId) {
        await kv.srem(`user:${userId}:chats`, chatId)
      } else {
        // Remove from anonymous chats
        await kv.srem(`anonymous:chats`, chatId)
      }

      logger.info("Chat deleted successfully", { chatId, userId })
      return true
    } catch (error) {
      logger.error("Error deleting chat", { error, chatId })
      return false
    }
  }

  /**
   * Clear all chats for a user
   */
  async clearUserChats(userId: string): Promise<boolean> {
    try {
      // Get all chat IDs for this user
      const chatIds = await kv.smembers<string>(`user:${userId}:chats`)

      if (chatIds && chatIds.length > 0) {
        // Delete each chat
        for (const chatId of chatIds) {
          await this.deleteChat(chatId, userId)
        }
      }

      // Delete the user's chat list
      await kv.del(`user:${userId}:chats`)

      logger.info("All user chats cleared successfully", { userId })
      return true
    } catch (error) {
      logger.error("Error clearing user chats", { error, userId })
      return false
    }
  }
}

// Export singleton instance
export const chatHistoryService = ChatHistoryService.getInstance()
