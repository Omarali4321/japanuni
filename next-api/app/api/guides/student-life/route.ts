import { NextRequest } from 'next/server'
import { studentLifeDto } from '../../../../lib/content'
import { paginationSchema } from '../../../../lib/content-validation'
import { handleRouteError, jsonList } from '../../../../lib/http'
import { prisma } from '../../../../lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const query = paginationSchema.parse(Object.fromEntries(request.nextUrl.searchParams.entries()))
    const [totalElements, articles] = await prisma.$transaction([
      prisma.studentLifeArticle.count(),
      prisma.studentLifeArticle.findMany({
        orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
        skip: query.page * query.size,
        take: query.size,
      }),
    ])
    return jsonList(articles.map(studentLifeDto), {
      page: query.page,
      size: query.size,
      totalElements,
      totalPages: Math.ceil(totalElements / query.size),
    })
  } catch (error) {
    return handleRouteError(error)
  }
}
