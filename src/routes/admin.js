import express from 'express'
import Product from '../models/Product.js'
import Order from '../models/Order.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'
const router = express.Router()
router.post('/products', requireAuth, requireAdmin, async (req, res) => {
  const prod = await Product.create(req.body)
  res.status(201).json(prod)
})
router.put('/products/:id', requireAuth, requireAdmin, async (req, res) => {
  const prod = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
  if (!prod) return res.status(404).json({ error: 'Not found' })
  res.json(prod)
})
router.delete('/products/:id', requireAuth, requireAdmin, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id)
  res.json({ ok: true })
})
router.get('/orders', requireAuth, requireAdmin, async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 })
  res.json(orders)
})
export default router
