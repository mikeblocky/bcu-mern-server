import express from 'express'
import Product from '../models/Product.js'
const router = express.Router()
router.get('/', async (req, res) => {
  const { q, category, page = 1, limit = 12 } = req.query
  const filter = { active: true }
  if (category) filter.category = category
  if (q) filter.name = { $regex: q, $options: 'i' }
  const skip = (Number(page) - 1) * Number(limit)
  const [items, total] = await Promise.all([
    Product.find(filter).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
    Product.countDocuments(filter)
  ])
  res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) })
})
router.get('/:id', async (req, res) => {
  const prod = await Product.findById(req.params.id)
  if (!prod || !prod.active) return res.status(404).json({ error: 'Not found' })
  res.json(prod)
})
export default router
