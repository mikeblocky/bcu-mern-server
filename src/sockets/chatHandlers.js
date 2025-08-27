import Message from '../models/Message.js'
export default function registerChatHandlers(io, socket) {
  const user = socket.user
  socket.on('join', async (room) => {
    socket.join(room)
    io.to(room).emit('presence', { user: user.username, status: 'joined' })
    const recent = await Message.find({ room }).sort({ createdAt: -1 }).limit(30).populate('sender', 'username')
    socket.emit('history', recent.reverse())
  })
  socket.on('typing', (room, isTyping) => {
    socket.to(room).emit('typing', { user: user.username, isTyping })
  })
  socket.on('message', async ({ room, content }) => {
    if (!room || !content?.trim()) return
    const msg = await Message.create({ room, content: content.trim(), sender: user.id })
    const populated = await msg.populate('sender', 'username')
    io.to(room).emit('message', { id: populated._id, content: populated.content, sender: populated.sender.username, timestamp: populated.timestamp })
  })
}