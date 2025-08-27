// server/src/utils/seedSampleProducts.js
import Product from '../models/Product.js'

/**
 * Inserts sample products if the collection is empty.
 * If reset=true, it clears existing products then inserts the sample set.
 * Returns { seeded:boolean, count:number }
 */
export async function ensureSampleProducts({ reset = false } = {}) {
  if (reset) {
    await Product.deleteMany({})
  }

  const count = await Product.countDocuments()
  if (count > 0 && !reset) {
    return { seeded: false, count }
  }

  const sample = [
    {
      name: 'Beige Hoodie',
      description: 'Soft fleece hoodie in warm beige. Cozy and minimal.',
      images: ['https://picsum.photos/seed/beige-hoodie/800/600'],
      category: 'apparel',
      price: 48,
      inventory: 20,
      active: true,
    },
    {
      name: 'Mono Tee',
      description: 'Lightweight tee with a clean mono print.',
      images: ['https://picsum.photos/seed/mono-tee/800/600'],
      category: 'apparel',
      price: 22,
      inventory: 40,
      active: true,
    },
    {
      name: 'Canvas Tote',
      description: 'Heavy-duty canvas tote. Carries books, dreams, groceries.',
      images: ['https://picsum.photos/seed/canvas-tote/800/600'],
      category: 'bags',
      price: 18,
      inventory: 35,
      active: true,
    },
    {
      name: 'Desk Mat',
      description: 'PU leather desk mat in soft sand. Smooth and simple.',
      images: ['https://picsum.photos/seed/desk-mat/800/600'],
      category: 'desk',
      price: 29,
      inventory: 25,
      active: true,
    },
    {
      name: 'Sticker Pack',
      description: 'Minimal stickers for your laptop. Beige, line art, tasteful.',
      images: ['https://picsum.photos/seed/stickers/800/600'],
      category: 'accessories',
      price: 6,
      inventory: 200,
      active: true,
    },
    {
      name: 'Ceramic Mug',
      description: 'Matte clay mug for late-night builds and early ideas.',
      images: ['https://picsum.photos/seed/mug/800/600'],
      category: 'home',
      price: 14,
      inventory: 50,
      active: true,
    },
    {
      name: 'Minimal Cap',
      description: 'Unstructured cap, tiny logo. Shade + understatement.',
      images: ['https://picsum.photos/seed/cap/800/600'],
      category: 'apparel',
      price: 19,
      inventory: 30,
      active: true,
    },
    {
      name: 'Mono Notebook',
      description: 'Dot-grid, 120 pages, lays flat. For thoughts worth catching.',
      images: ['https://picsum.photos/seed/notebook/800/600'],
      category: 'stationery',
      price: 12,
      inventory: 60,
      active: true,
    },
    {
      name: 'Ink Pen Set',
      description: 'Fine-tip black ink pair. Smooth lines, zero drama.',
      images: ['https://picsum.photos/seed/pens/800/600'],
      category: 'stationery',
      price: 9,
      inventory: 100,
      active: true,
    },
    {
      name: 'A2 Poster',
      description: 'Muted palette art print. Quiet on the wall, loud in spirit.',
      images: ['https://picsum.photos/seed/poster/800/600'],
      category: 'prints',
      price: 24,
      inventory: 15,
      active: true,
    },
  ]

  if (count === 0 || reset) {
    await Product.insertMany(sample)
    return { seeded: true, count: sample.length }
  }

  return { seeded: false, count }
}
