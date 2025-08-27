import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { requireAuth } from '../middleware/auth.js'
const router = express.Router()
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body
    if (!username || !email || !password) return res.status(400).json({ error: 'Missing fields' })
    const existing = await User.findOne({ $or: [{ email }, { username }] })
    if (existing) return res.status(409).json({ error: 'User already exists' })
    const hash = await bcrypt.hash(password, 10)
    const user = await User.create({ username, email, password: hash })
    const token = jwt.sign({ id: user._id, username, email, isAdmin: user.isAdmin }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' })
    res.status(201).json({ token })
  } catch (e) { res.status(500).json({ error: e.message }) }
})
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })
    const ok = await bcrypt.compare(password, user.password)
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' })
    const token = jwt.sign({ id: user._id, username: user.username, email, isAdmin: user.isAdmin }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' })
    res.json({ token })
  } catch (e) { res.status(500).json({ error: e.message }) }
})
router.get('/profile', requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password')
  res.json({ user })
})
export default router
