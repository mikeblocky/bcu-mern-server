import express from 'express'
import Task from '../models/Task.js'
import { requireAuth } from '../middleware/auth.js'
const router = express.Router()
router.get('/', requireAuth, async (req, res) => {
  const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 })
  res.json(tasks)
})
router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, description } = req.body
    if (!title || !title.trim()) return res.status(400).json({ error: 'Title is required' })
    const task = await Task.create({ title: title.trim(), description: description||'', userId: req.user.id })
    res.status(201).json(task)
  } catch (e) { res.status(500).json({ error: e.message }) }
})
router.get('/:id', requireAuth, async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, userId: req.user.id })
  if (!task) return res.status(404).json({ error: 'Not found' })
  res.json(task)
})
router.put('/:id', requireAuth, async (req, res) => {
  const updates = (({ title, description, completed }) => ({ title, description, completed }))(req.body)
  if (typeof updates.title === 'string') updates.title = updates.title.trim()
  const task = await Task.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, updates, { new: true })
  if (!task) return res.status(404).json({ error: 'Not found' })
  res.json(task)
})
router.delete('/:id', requireAuth, async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id })
  if (!task) return res.status(404).json({ error: 'Not found' })
  res.json({ ok: true })
})
export default router
