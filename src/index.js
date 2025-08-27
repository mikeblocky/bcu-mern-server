// src/index.js
import http from 'http'
import mongoose from 'mongoose'
import { createExpressApp } from './app.js'
import { initSocket } from './sockets/index.js'
import { config } from './config/env.js'
import { ensureSampleProducts } from './utils/seedSampleProducts.js'

async function main() {
  const app = createExpressApp(config)
  const server = http.createServer(app)

  // Mongo
  await mongoose.connect(config.mongoUri, { dbName: config.mongoDbName })
  console.log('[mongo] connected to', config.mongoDbName)

  // Auto-seed products (optional, defaults ON)
  if (config.autoSeed) {
    try {
      const { seeded, count } = await ensureSampleProducts({ reset: config.autoSeedReset })
      console.log(`[seed] products ${seeded ? 'inserted' : 'found'}: ${count}`)
    } catch (e) {
      console.error('[seed] error:', e)
    }
  }

  // Socket.io
  initSocket(server, config.allowedOrigins)

  // Start server
  const port = config.port
  server.listen(port, () => {
    console.log(`[server] http://localhost:${port}`)
  })
}

// Guard: unhandled rejections/logging
process.on('unhandledRejection', err => {
  console.error('[unhandledRejection]', err)
})
process.on('uncaughtException', err => {
  console.error('[uncaughtException]', err)
})

main().catch(err => {
  console.error('Fatal bootstrap error:', err)
  process.exit(1)
})
