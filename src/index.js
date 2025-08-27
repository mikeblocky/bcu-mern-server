import http from 'http'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { Server as IOServer } from 'socket.io'

import authRoutes from './routes/auth.js'
import taskRoutes from './routes/tasks.js'
import productRoutes from './routes/products.js'
import orderRoutes from './routes/orders.js'
import adminRoutes from './routes/admin.js'
import { verifySocket } from './sockets/verifySocket.js'
import registerChatHandlers from './sockets/chatHandlers.js'

dotenv.config()

const app = express()

// -------------------- CORS allowlist (supports wildcards) --------------------
const raw = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean)

// exact domains (no wildcards)
const exact = new Set(
  raw
    .filter(o => !o.includes('*') && !o.startsWith('regex:'))
    .map(o => o.replace(/\/$/, '').toLowerCase())
)

// wildcard / regex patterns
const patterns = raw
  .filter(o => o.includes('*') || o.startsWith('regex:'))
  .map(p => {
    if (p.startsWith('regex:')) return new RegExp(p.slice(6))
    const esc = p
      .replace(/\/$/, '')
      .replace(/[.+?^${}()|[\]\\]/g, '\\.')
      .replace(/\*/g, '.*')
    return new RegExp('^' + esc + '$', 'i')
  })

function isAllowed(origin) {
  if (!origin) return true // allow non-browser clients (e.g., curl)
  const o = origin.replace(/\/$/, '').toLowerCase()
  if (exact.has(o)) return true
  return patterns.some(rx => rx.test(o))
}

app.use(
  cors({
    origin(origin, cb) {
      if (isAllowed(origin)) return cb(null, true)
      return cb(new Error('CORS not allowed: ' + origin))
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 204
  })
)

// -------------------- Middleware --------------------
app.use(helmet())
app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())

// -------------------- Config --------------------
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017'
const DBNAME = process.env.MONGODB_DBNAME || 'bcu_lab5'
const PORT = process.env.PORT || 4000

// -------------------- Routes --------------------
app.get('/', (req, res) => res.json({ ok: true, service: 'BCU MERN Homeworks API' }))
app.use('/api/auth', authRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/admin', adminRoutes)

// -------------------- HTTP + Socket.io --------------------
const server = http.createServer(app)

const io = new IOServer(server, {
  cors: {
    origin(origin, cb) {
      if (isAllowed(origin)) return cb(null, true)
      return cb(new Error('CORS not allowed (socket): ' + origin))
    },
    credentials: true
  }
})

io.use(verifySocket) // JWT auth for sockets
io.on('connection', socket => registerChatHandlers(io, socket))

// -------------------- DB connect + start --------------------
mongoose
  .connect(MONGODB_URI, { dbName: DBNAME })
  .then(() => {
    console.log('[mongo] connected to', DBNAME)
    server.listen(PORT, () => console.log(`[server] http://localhost:${PORT}`))
  })
  .catch(err => {
    console.error('Mongo connection error:', err.message)
    process.exit(1)
  })
