import { MongoMemoryServer } from 'mongodb-memory-server'
import * as fs from 'fs'
import * as path from 'path'

async function setupDevDB() {
  console.log('🚀 Starting in-memory MongoDB server for development...\n')

  try {
    // Create MongoDB Memory Server instance
    const mongod = await MongoMemoryServer.create({
      instance: {
        port: 27017, // Use default MongoDB port
        dbName: 'surbhisweetmart',
      },
    })

    const uri = mongod.getUri()
    console.log('✅ MongoDB Memory Server started successfully!')
    console.log(`📡 Connection URI: ${uri}`)
    console.log(`🔌 Port: 27017`)
    console.log(`📊 Database: surbhisweetmart\n`)

    // Update .env.local with the new URI
    const envPath = path.join(__dirname, '..', '.env.local')
    let envContent = fs.readFileSync(envPath, 'utf-8')

    // Update MONGODB_URI
    envContent = envContent.replace(
      /MONGODB_URI=.*/,
      `MONGODB_URI=${uri}surbhisweetmart`
    )

    fs.writeFileSync(envPath, envContent)
    console.log('✅ Updated .env.local with MongoDB URI\n')

    console.log('💡 Tips:')
    console.log('   - This is an in-memory database (data will be lost on restart)')
    console.log('   - Perfect for development and testing')
    console.log('   - To create admin user, run: npm run seed:admin')
    console.log('\n⚠️  Keep this terminal open to keep MongoDB running!')
    console.log('   Press Ctrl+C to stop\n')

    // Keep the process running
    process.on('SIGINT', async () => {
      console.log('\n\n🛑 Shutting down MongoDB Memory Server...')
      await mongod.stop()
      console.log('✅ MongoDB stopped successfully')
      process.exit(0)
    })

    // Keep process alive
    await new Promise(() => {})
  } catch (error) {
    console.error('❌ Error starting MongoDB:', error)
    process.exit(1)
  }
}

setupDevDB()
