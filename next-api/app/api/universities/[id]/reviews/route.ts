import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '../../../../../lib/auth'
import { handleRouteError, jsonError, unauthorized } from '../../../../../lib/http'
import { prisma } from '../../../../../lib/prisma'
import { reviewSchema } from '../../../../../lib/user-validation'
import { universityIdSchema } from '../../../../../lib/university-validation'
import { getUniversityById } from '../../../../../lib/data'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function reviewDto(review: {
  id: bigint
  rating: number
  comment: string | null
  createdAt: Date
  user: { fullName: string }
}) {
  return {
    id: Number(review.id),
    rating: review.rating,
    comment: review.comment,
    userName: review.user.fullName,
    createdAt: review.createdAt.toISOString(),
  }
}

export async function GET(
  _request: NextRequest,
  context: { params: { id: string } },
) {
  try {
    const universityId = BigInt(universityIdSchema.parse(context.params.id))
    const reviews = await prisma.review.findMany({
      where: { universityId },
      include: { user: { select: { fullName: true } } },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(reviews.map(reviewDto))
  } catch (error) {
    return handleRouteError(error)
  }
}

export async function POST(
  request: NextRequest,
  context: { params: { id: string } },
) {
  try {
    const user = await getSessionUser()
    if (!user) return unauthorized()
    const universityId = BigInt(universityIdSchema.parse(context.params.id))
    const input = reviewSchema.parse(await request.json())
    const university = getUniversityById(Number(universityId))
    if (!university) return jsonError(404, 'UNIVERSITY_NOT_FOUND', 'University not found')

    const review = await prisma.review.create({
      data: { userId: user.id, universityId, rating: input.rating, comment: input.comment ?? null },
      include: { user: { select: { fullName: true } } },
    })
    return NextResponse.json(reviewDto(review))
  } catch (error) {
    return handleRouteError(error)
  }
}
