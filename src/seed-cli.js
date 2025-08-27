import mongoose from 'mongoose'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import User from './models/User.js'
import Product from './models/Product.js'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017'
const DBNAME = process.env.MONGODB_DBNAME || 'bcu_lab5'

async function main() {
  await mongoose.connect(MONGODB_URI, { dbName: DBNAME })
  console.log('[seed] connected')

  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@shop.local'
  const adminPass  = process.env.SEED_ADMIN_PASS  || 'changeme123'

  // admin
  let admin = await User.findOne({ email: adminEmail })
  if (!admin) {
    const hash = await bcrypt.hash(adminPass, 10)
    admin = await User.create({ username:'admin', email: adminEmail, password: hash, isAdmin: true })
    console.log('[seed] admin created:', adminEmail)
  } else {
    console.log('[seed] admin exists:', adminEmail)
  }

  const count = await Product.countDocuments()
  if (count === 0) {
    await Product.insertMany(sampleProducts())
    console.log('[seed] inserted sample products')
  } else {
    console.log('[seed] products already exist:', count)
  }

  await mongoose.disconnect()
  console.log('[seed] done')
}

function sampleProducts() {
  return [
    { name:'Beige Hoodie', description:'Soft fleece hoodie in warm beige.', price:48, inventory:20, active:true, category:'apparel', images:['https://picsum.photos/seed/beige-hoodie/800/600'] },
    { name:'Mono Tee', description:'Lightweight tee with a mono print.', price:22, inventory:40, active:true, category:'apparel', images:['https://picsum.photos/seed/mono-tee/800/600'] },
    { name:'Canvas Tote', description:'Heavy-duty canvas tote.', price:18, inventory:35, active:true, category:'bags', images:['https://picsum.photos/seed/canvas-tote/800/600'] },
    { name:'Desk Mat', description:'PU leather desk mat in sand.', price:29, inventory:25, active:true, category:'desk', images:['https://picsum.photos/seed/desk-mat/800/600'] },
    { name:'Sticker Pack', description:'Minimal sticker set.', price:6, inventory:200, active:true, category:'accessories', images:['https://picsum.photos/seed/stickers/800/600'] },
    { name:'Ceramic Mug', description:'Matte clay mug.', price:14, inventory:50, active:true, category:'home', images:['https://picsum.photos/seed/mug/800/600'] },
    { name:'Minimal Cap', description:'Unstructured cap.', price:19, inventory:30, active:true, category:'apparel', images:['https://picsum.photos/seed/cap/800/600'] },
    { name:'Mono Notebook', description:'Dot-grid notebook.', price:12, inventory:60, active:true, category:'stationery', images:['https://picsum.photos/seed/notebook/800/600'] },
    { name:'Ink Pen Set', description:'Fine-tip black ink.', price:9, inventory:100, active:true, category:'stationery', images:['https://picsum.photos/seed/pens/800/600'] },
    { name:'A2 Poster', description:'Muted palette art print.', price:24, inventory:15, active:true, category:'prints', images:['https://picsum.photos/seed/poster/800/600'] },
  ]
}

main().catch(err => { console.error(err); process.exit(1) })
