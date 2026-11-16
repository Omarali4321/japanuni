import { NextResponse } from 'next/server'
import { getDatabasePool } from '../../../lib/database'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const pool = getDatabasePool()
    await pool.query('SELECT 1')

    return NextResponse.json({
      status: 'ok',
      database: 'ok',
    })
  } catch (error) {
    console.error('Health check failed', error)

    return NextResponse.json(
      {
        status: 'degraded',
        database: 'unavailable',
      },
      { status: 503 },
    )
  }
}
