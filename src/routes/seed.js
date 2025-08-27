import express from 'express'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import Product from '../models/Product.js'

const router = express.Router()

/**
 * POST /api/seed?key=YOUR_SEED_KEY&reset=1
 * Header alternative: x-seed-key: YOUR_SEED_KEY
 * - Creates an admin user if missing
 * - Inserts sample products (or resets & re-inserts if reset=1)
 */
router.post('/', async (req, res) => {
  const key = req.query.key || req.header('x-seed-key')
  if (!process.env.SEED_KEY) {
    return res.status(403).json({ error: 'SEED_KEY not configured on server' })
  }
  if (key !== process.env.SEED_KEY) {
    return res.status(403).json({ error: 'Forbidden: bad seed key' })
  }

  const reset = String(req.query.reset || '').toLowerCase() === '1'

  try {
    // 1) Admin user
    const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@shop.local'
    const adminPass  = process.env.SEED_ADMIN_PASS  || 'changeme123'
    let admin = await User.findOne({ email: adminEmail })
    if (!admin) {
      const hash = await bcrypt.hash(adminPass, 10)
      admin = await User.create({
        username: 'admin',
        email: adminEmail,
        password: hash,
        isAdmin: true
      })
    }

    // 2) Products
    let productAction = 'skipped'
    if (reset) {
      await Product.deleteMany({})
      productAction = 'reset'
    }
    const count = await Product.countDocuments()
    let inserted = 0
    if (count === 0) {
      const data = sampleProducts()
      await Product.insertMany(data)
      inserted = data.length
      productAction = productAction === 'reset' ? 'reset+inserted' : 'inserted'
    }

    return res.json({
      ok: true,
      admin: { email: adminEmail, password: adminPass, isAdmin: true },
      products: productAction,
      inserted
    })
  } catch (e) {
    console.error('[seed] error:', e)
    return res.status(500).json({ error: e.message })
  }
})

export default router

function sampleProducts() {
  // beige vibes + mono aesthetic
  return [
    {
      name: 'Beige Hoodie',
      description: 'Soft fleece hoodie in warm beige. Cozy and minimal.',
      images: ['https://picsum.photos/seed/beige-hoodie/800/600'],
      category: 'apparel',
      price: 48,
      inventory: 20,
      active: true
    },
    {
      name: 'Mono Tee',
      description: 'Lightweight tee with a clean mono print.',
      images: ['https://picsum.photos/seed/mono-tee/800/600'],
      category: 'apparel',
      price: 22,
      inventory: 40,
      active: true
    },
    {
      name: 'Canvas Tote',
      description: 'Heavy-duty canvas tote. Carries books, dreams, groceries.',
      images: ['https://picsum.photos/seed/canvas-tote/800/600'],
      category: 'bags',
      price: 18,
      inventory: 35,
      active: true
    },
    {
      name: 'Desk Mat',
      description: 'PU leather desk mat in soft sand. Smooth and simple.',
      images: ['https://picsum.photos/seed/desk-mat/800/600'],
      category: 'desk',
      price: 29,
      inventory: 25,
      active: true
    },
    {
      name: 'Sticker Pack',
      description: 'Minimal stickers for your laptop. Beige, line art, tasteful.',
      images: ['https://picsum.photos/seed/stickers/800/600'],
      category: 'accessories',
      price: 6,
      inventory: 200,
      active: true
    },
    {
      name: 'Ceramic Mug',
      description: 'Matte clay mug for late-night builds and early ideas.',
      images: ['https://picsum.photos/seed/mug/800/600'],
      category: 'home',
      price: 14,
      inventory: 50,
      active: true
    },
    {
      name: 'Minimal Cap',
      description: 'Unstructured cap, tiny logo. Shade + understatement.',
      images: ['https://picsum.photos/seed/cap/800/600'],
      category: 'apparel',
      price: 19,
      inventory: 30,
      active: true
    },
    {
      name: 'Mono Notebook',
      description: 'Dot-grid, 120 pages, lays flat. For thoughts worth catching.',
      images: ['https://picsum.photos/seed/notebook/800/600'],
      category: 'stationery',
      price: 12,
      inventory: 60,
      active: true
    },
    {
      name: 'Ink Pen Set',
      description: 'Fine-tip black ink pair. Smooth lines, zero drama.',
      images: ['https://picsum.photos/seed/pens/800/600'],
      category: 'stationery',
      price: 9,
      inventory: 100,
      active: true
    },
    {
      name: 'A2 Poster',
      description: 'Muted palette art print. Quiet on the wall, loud in spirit.',
      images: ['https://picsum.photos/seed/poster/800/600'],
      category: 'prints',
      price: 24,
      inventory: 15,
      active: true
    }
  ]
}
