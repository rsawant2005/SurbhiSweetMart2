// In production, this would connect to MongoDB

interface User {
  _id: string
  name: string
  email: string
  password: string
  token?: string
  lastLogin?: Date
  createdAt: Date
}

// In-memory store for preview environment
const mockUsers: Map<string, User> = new Map()

export async function connectToDatabase() {
  // Mock implementation - returns a dummy client
  return { connected: true }
}

export async function getDatabase() {
  return {
    collection: (name: string) => {
      if (name === "users") {
        return {
          findOne: async (query: Record<string, any>) => {
            for (const user of mockUsers.values()) {
              if (query.email && user.email === query.email) {
                return user
              }
              if (query._id && user._id === query._id) {
                return user
              }
            }
            return null
          },
          insertOne: async (data: Omit<User, "_id">) => {
            const id = Date.now().toString()
            const user: User = { ...data, _id: id }
            mockUsers.set(id, user)
            return { insertedId: id }
          },
          updateOne: async (query: Record<string, any>, update: Record<string, any>) => {
            for (const user of mockUsers.values()) {
              if (query._id && user._id === query._id) {
                const updateData = update.$set || update
                Object.assign(user, updateData)
                return { modifiedCount: 1 }
              }
            }
            return { modifiedCount: 0 }
          },
        }
      }
      return {}
    },
  }
}
