import mongoose from 'mongoose'
const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
}, { _id: false })
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  status: { type: String, default: 'pending', enum: ['pending','paid','shipped','completed','cancelled'] },
  total: { type: Number, required: true },
  shippingAddress: {
    fullName: String, line1: String, line2: String, city: String, country: String, zip: String
  }
}, { timestamps: true })
export default mongoose.model('Order', orderSchema)
