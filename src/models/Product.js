import mongoose from 'mongoose'
const variantSchema = new mongoose.Schema({
  sku: String, size: String, color: String,
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 }
}, { _id: false })
const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: String,
  images: [String],
  category: { type: String, index: true },
  variants: [variantSchema],
  price: { type: Number, required: true },
  inventory: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
}, { timestamps: true })
export default mongoose.model('Product', productSchema)
