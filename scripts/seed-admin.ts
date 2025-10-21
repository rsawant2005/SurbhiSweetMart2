import * as readline from 'readline'
import { connectToDatabase, User } from '../lib/db'
import { hashPassword } from '../lib/auth'

// Create readline interface for prompts
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

// Promisify readline question
function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve)
  })
}

async function seedAdmin() {
  try {
    console.log('=== Admin User Seed Script ===\n')

    // Get admin email from ENV or prompt
    let adminEmail = process.env.SEED_ADMIN_EMAIL
    if (!adminEmail) {
      adminEmail = await question('Enter admin email: ')
    } else {
      console.log(`Using admin email from ENV: ${adminEmail}`)
    }

    // Validate email
    if (!adminEmail || !adminEmail.includes('@')) {
      console.error('Error: Invalid email address')
      rl.close()
      process.exit(1)
    }

    // Get admin password from ENV or prompt
    let adminPassword = process.env.SEED_ADMIN_PASSWORD
    if (!adminPassword) {
      adminPassword = await question('Enter admin password (min 8 characters): ')
    } else {
      console.log('Using admin password from ENV')
    }

    // Validate password
    if (!adminPassword || adminPassword.length < 8) {
      console.error('Error: Password must be at least 8 characters')
      rl.close()
      process.exit(1)
    }

    console.log('\nConnecting to database...')

    // Connect to MongoDB
    await connectToDatabase()

    console.log('Database connected successfully')

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail })

    if (existingAdmin) {
      console.log(`\nAdmin user with email "${adminEmail}" already exists.`)
      console.log('Skipping creation.')
      rl.close()
      process.exit(0)
    }

    // Hash password
    console.log('Hashing password...')
    const hashedPassword = await hashPassword(adminPassword)

    // Create admin user
    console.log('Creating admin user...')
    const adminUser = await User.create({
      name: 'Admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date(),
    })

    console.log('\n✅ Admin user created successfully!')
    console.log(`Email: ${adminUser.email}`)
    console.log(`Role: ${adminUser.role}`)
    console.log(`\nYou can now login at /admin/login with these credentials.`)

    rl.close()
    process.exit(0)
  } catch (error) {
    console.error('\n❌ Error creating admin user:', error)
    rl.close()
    process.exit(1)
  }
}

// Run the seed script
seedAdmin()
