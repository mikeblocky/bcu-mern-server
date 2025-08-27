import mongoose from 'mongoose'
const messageSchema = new mongoose.Schema({
  content: { type: String, required: true },
  room: { type: String, required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  timestamp: { type: Date, default: Date.now },
}, { timestamps: true })
export default mongoose.model('Message', messageSchema)
