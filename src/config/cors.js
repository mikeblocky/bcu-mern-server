// src/config/cors.js
import cors from 'cors'

export function buildOriginChecker(allowedList) {
  const exact = new Set(
    allowedList
      .filter(o => !o.includes('*') && !o.startsWith('regex:'))
      .map(o => o.replace(/\/$/, '').toLowerCase())
  )

  const patterns = allowedList
    .filter(o => o.includes('*') || o.startsWith('regex:'))
    .map(p => {
      if (p.startsWith('regex:')) return new RegExp(p.slice(6))
      const esc = p.replace(/\/$/, '').replace(/[.+?^${}()|[\]\\]/g, '\\.').replace(/\*/g, '.*')
      return new RegExp('^' + esc + '$', 'i')
    })

  return function isAllowed(origin) {
    if (!origin) return true // non-browser clients
    const o = origin.replace(/\/$/, '').toLowerCase()
    if (exact.has(o)) return true
    return patterns.some(rx => rx.test(o))
  }
}

export function expressCors(allowedList) {
  const isAllowed = buildOriginChecker(allowedList)
  return cors({
    origin(origin, cb) {
      if (isAllowed(origin)) return cb(null, true)
      return cb(new Error('CORS not allowed: ' + origin))
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 204,
  })
}

// For Socket.io: pass a function(origin, cb) directly.
export function socketCorsOrigin(allowedList) {
  const isAllowed = buildOriginChecker(allowedList)
  return function (origin, cb) {
    if (isAllowed(origin)) return cb(null, true)
    return cb(new Error('CORS not allowed (socket): ' + origin))
  }
}
