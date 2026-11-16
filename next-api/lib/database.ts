import { Pool } from 'pg'

const globalForDatabase = globalThis as unknown as {
  japanUniPool?: Pool
}

export function getDatabasePool() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL is not configured')
  }

  if (!globalForDatabase.japanUniPool) {
    globalForDatabase.japanUniPool = new Pool({
      connectionString,
      max: 1,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 3_000,
    })
  }

  return globalForDatabase.japanUniPool
}
