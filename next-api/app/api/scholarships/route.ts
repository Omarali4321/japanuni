import { NextRequest } from 'next/server'
import { handleRouteError, jsonList } from '../../../lib/http'
import { scholarshipDto, scholarshipInclude } from '../../../lib/content'
import { prisma } from '../../../lib/prisma'
import { scholarshipQuerySchema } from '../../../lib/content-validation'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const query = scholarshipQuerySchema.parse(
      Object.fromEntries(request.nextUrl.searchParams.entries()),
    )
    const where = {
      ...(query.search
        ? { title: { contains: query.search, mode: 'insensitive' as const } }
        : {}),
      ...(query.universityId ? { universityId: BigInt(query.universityId) } : {}),
    }
    const [totalElements, scholarships] = await prisma.$transaction([
      prisma.scholarship.count({ where }),
      prisma.scholarship.findMany({
        where,
        include: scholarshipInclude,
        orderBy: [{ title: 'asc' }, { id: 'asc' }],
        skip: query.page * query.size,
        take: query.size,
      }),
    ])

    return jsonList(scholarships.map(scholarshipDto), {
      page: query.page,
      size: query.size,
      totalElements,
      totalPages: Math.ceil(totalElements / query.size),
    })
  } catch (error) {
    return handleRouteError(error)
  }
}
