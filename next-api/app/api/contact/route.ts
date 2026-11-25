import { NextRequest, NextResponse } from 'next/server'
import { contactSchema } from '../../../lib/contact-validation'
import { handleRouteError } from '../../../lib/http'
import { prisma } from '../../../lib/prisma'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const input = contactSchema.parse(await request.json())
    await prisma.contactMessage.create({ data: input })
    return NextResponse.json({ success: true })
  } catch (error) {
    return handleRouteError(error)
  }
}
