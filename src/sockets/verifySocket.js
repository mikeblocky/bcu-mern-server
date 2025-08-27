import jwt from 'jsonwebtoken'
export function verifySocket(socket, next) {
  const token = socket.handshake.auth?.token || socket.handshake.query?.token
  if (!token) return next(new Error('Missing token'))
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret')
    socket.user = payload
    next()
  } catch (e) { next(new Error('Invalid token')) }
}