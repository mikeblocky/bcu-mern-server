import mongoose from 'mongoose'
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email:    { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  isAdmin:  { type: Boolean, default: false },
}, { timestamps: true })
export default mongoose.model('User', userSchema)
