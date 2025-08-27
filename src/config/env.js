// src/config/env.js
import dotenv from 'dotenv'
dotenv.config()

function bool(v, def = false) {
  if (v === undefined) return def
  return ['1', 'true', 'yes', 'on'].includes(String(v).toLowerCase())
}

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 4000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017',
  mongoDbName: process.env.MONGODB_DBNAME || 'bcu_lab5',

  // CORS allowlist (comma-separated), supports wildcards and regex:.* with `regex:`
  allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:5173')
    .split(',').map(s => s.trim()).filter(Boolean),

  // Seeder toggles
  autoSeed: bool(process.env.AUTO_SEED, true),         // default ON
  autoSeedReset: bool(process.env.AUTO_SEED_RESET, false),

  // Optional HTTP seed route (POST /api/seed?key=...)
  seedKey: process.env.SEED_KEY || '',
  seedAdminEmail: process.env.SEED_ADMIN_EMAIL || 'admin@shop.local',
  seedAdminPass: process.env.SEED_ADMIN_PASS || 'changeme123',
}
