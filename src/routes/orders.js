import express from 'express'
import Order from '../models/Order.js'
import Product from '../models/Product.js'
import { requireAuth } from '../middleware/auth.js'
const router = express.Router()
router.get('/', requireAuth, async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 })
  res.json(orders)
})
router.post('/', requireAuth, async (req, res) => {
  const { items = [], shippingAddress = {} } = req.body
  if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'Cart is empty' })
  let total = 0
  for (const it of items) {
    const prod = await Product.findById(it.product)
    if (!prod || !prod.active) return res.status(400).json({ error: 'Invalid product' })
    if (prod.inventory < it.quantity) return res.status(400).json({ error: `Insufficient stock for ${prod.name}` })
    total += (it.price ?? prod.price) * it.quantity
    prod.inventory -= it.quantity
    await prod.save()
  }
  const order = await Order.create({ user: req.user.id, items, total, shippingAddress })
  res.status(201).json(order)
})
export default router
