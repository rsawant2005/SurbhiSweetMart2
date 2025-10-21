import mongoose from 'mongoose'

// MongoDB connection
export async function connectToDatabase(): Promise<void> {
  // Check if already connected
  if (mongoose.connection.readyState === 1) {
    return
  }

  try {
    const mongoUri = process.env.MONGODB_URI

    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not defined')
    }

    await mongoose.connect(mongoUri)
    console.log('MongoDB connected successfully')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    throw error
  }
}

export function getDatabase(): mongoose.Connection {
  if (mongoose.connection.readyState === 0) {
    throw new Error('Database not connected. Call connectToDatabase() first.')
  }
  return mongoose.connection
}

// User Schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  refreshToken: {
    type: String,
    default: null,
  },
  refreshTokenExpiry: {
    type: Date,
    default: null,
  },
  lastLogin: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Export User Model (handles Next.js hot reload)
export const User = mongoose.models.User || mongoose.model('User', UserSchema)
