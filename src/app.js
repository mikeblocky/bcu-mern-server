// src/app.js
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import buildApiRouter from './routes/index.js'
import { expressCors } from './config/cors.js'

export function createExpressApp(config) {
  const app = express()

  // Render/Vercel-friendly
  app.set('trust proxy', 1)

  // CORS (shared allowlist)
  app.use(expressCors(config.allowedOrigins))

  // Security + DX
  app.use(helmet())
  app.use(morgan('dev'))
  app.use(express.json())
  app.use(cookieParser())

  // Routes
  app.use('/', buildApiRouter({ enableSeed: !!config.seedKey }))

  // 404
  app.use((req, res, next) => {
    if (res.headersSent) return next()
    res.status(404).json({ error: 'Not found' })
  })

  // Error handler
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    const status = err.status || 500
    const payload = {
      error: err.message || 'Internal Server Error',
    }
    if (process.env.NODE_ENV !== 'production' && err.stack) {
      payload.stack = err.stack
    }
    res.status(status).json(payload)
  })

  return app
}
