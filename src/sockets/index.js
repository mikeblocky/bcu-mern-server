// src/sockets/index.js
import { Server as IOServer } from 'socket.io'
import { socketCorsOrigin } from '../config/cors.js'
import { verifySocket } from '../sockets/verifySocket.js'
import registerChatHandlers from '../sockets/chatHandlers.js'

export function initSocket(server, allowedOrigins) {
  const io = new IOServer(server, {
    cors: {
      origin: socketCorsOrigin(allowedOrigins),
      credentials: true,
    },
  })

  io.use(verifySocket) // JWT gate for sockets
  io.on('connection', socket => registerChatHandlers(io, socket))

  return io
}
