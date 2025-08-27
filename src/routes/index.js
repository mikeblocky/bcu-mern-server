// src/routes/index.js
import { Router } from 'express'
import authRoutes from '../routes/auth.js'
import taskRoutes from '../routes/tasks.js'
import productRoutes from '../routes/products.js'
import orderRoutes from '../routes/orders.js'
import adminRoutes from '../routes/admin.js'
import seedRoutes from '../routes/seed.js' // will be guarded by config in app.js

export default function buildApiRouter({ enableSeed }) {
  const r = Router()

  // Basic health
  r.get('/', (req, res) => res.json({ ok: true, service: 'BCU MERN Homeworks API' }))
  r.get('/healthz', (req, res) => res.json({ ok: true }))
  r.get('/readyz', (req, res) => res.json({ ok: true }))

  // API v1
  r.use('/api/auth', authRoutes)
  r.use('/api/tasks', taskRoutes)
  r.use('/api/products', productRoutes)
  r.use('/api/orders', orderRoutes)
  r.use('/api/admin', adminRoutes)

  if (enableSeed) {
    r.use('/api/seed', seedRoutes)
  }

  return r
}
