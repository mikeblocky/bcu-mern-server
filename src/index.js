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

// CORS allowlist (Render/Vercel friendly)
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean)

app.use(cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true)
    if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true)
    return cb(new Error('CORS blocked: ' + origin))
  },
  credentials: true
}))

app.use(helmet())
app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017'
const DBNAME = process.env.MONGODB_DBNAME || 'bcu_lab5'
const PORT = process.env.PORT || 4000

// Routes (API v1)
app.get('/', (req, res) => res.json({ ok: true, service: 'BCU MERN Homeworks API' }))
app.use('/api/auth', authRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/admin', adminRoutes)

// Create HTTP server + Socket.io
const server = http.createServer(app)
const io = new IOServer(server, { cors: { origin: ALLOWED_ORIGINS, credentials: true } })
io.use(verifySocket) // JWT auth for sockets
io.on('connection', (socket) => registerChatHandlers(io, socket))

// DB connect + start
mongoose.connect(MONGODB_URI, { dbName: DBNAME }).then(() => {
  console.log('[mongo] connected to', DBNAME)
  server.listen(PORT, () => console.log(`[server] http://localhost:${PORT}`))
}).catch(err => {
  console.error('Mongo connection error:', err.message)
  process.exit(1)
})
