import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '../../../../lib/auth'
import { handleRouteError, jsonError, unauthorized } from '../../../../lib/http'
import { prisma } from '../../../../lib/prisma'
import { reviewSchema } from '../../../../lib/user-validation'
import { universityIdSchema } from '../../../../lib/university-validation'

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

function reviewId(value: string) {
  return BigInt(universityIdSchema.parse(value))
}

export async function PUT(
  request: NextRequest,
  context: { params: { reviewId: string } },
) {
  try {
    const user = await getSessionUser()
    if (!user) return unauthorized()
    const id = reviewId(context.params.reviewId)
    const input = reviewSchema.parse(await request.json())
    const review = await prisma.review.findUnique({ where: { id } })
    if (!review) return jsonError(404, 'REVIEW_NOT_FOUND', 'Review not found')
    if (review.userId !== user.id) return jsonError(403, 'FORBIDDEN', 'You do not own this review')

    const updated = await prisma.review.update({
      where: { id },
      data: { rating: input.rating, comment: input.comment ?? null },
      include: { user: { select: { fullName: true } } },
    })
    return NextResponse.json(reviewDto(updated))
  } catch (error) {
    return handleRouteError(error)
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: { reviewId: string } },
) {
  try {
    const user = await getSessionUser()
    if (!user) return unauthorized()
    const id = reviewId(context.params.reviewId)
    const review = await prisma.review.findUnique({ where: { id } })
    if (!review) return jsonError(404, 'REVIEW_NOT_FOUND', 'Review not found')
    if (review.userId !== user.id) return jsonError(403, 'FORBIDDEN', 'You do not own this review')

    await prisma.review.delete({ where: { id } })
    return NextResponse.json({ message: 'Review deleted' })
  } catch (error) {
    return handleRouteError(error)
  }
}
