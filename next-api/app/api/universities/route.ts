import { Prisma } from '@prisma/client'
import { NextRequest } from 'next/server'
import { handleRouteError, jsonList } from '../../../lib/http'
import { prisma } from '../../../lib/prisma'
import { toUniversityDto, universityInclude, universityWhere } from '../../../lib/universities'
import { universityListQuerySchema } from '../../../lib/university-validation'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const raw = Object.fromEntries(request.nextUrl.searchParams.entries())
    const query = universityListQuerySchema.parse(raw)
    const where = universityWhere({
      search: query.search || undefined,
      cityId: query.cityId === undefined ? undefined : BigInt(query.cityId),
      maxTuition: query.maxTuition === undefined ? undefined : new Prisma.Decimal(query.maxTuition),
      minRanking: query.minRanking,
      institutionType: query.institutionType || undefined,
      mediumOfInstruction: query.mediumOfInstruction || undefined,
      preArrivalAdmission: query.preArrivalAdmission || undefined,
      intake: query.intake || undefined,
    })

    const [totalElements, universities] = await prisma.$transaction([
      prisma.university.count({ where }),
      prisma.university.findMany({
        where,
        include: universityInclude,
        orderBy: [{ ranking: 'asc' }, { name: 'asc' }],
        skip: query.page * query.size,
        take: query.size,
      }),
    ])

    return jsonList(
      universities.map(toUniversityDto),
      {
        page: query.page,
        size: query.size,
        totalElements,
        totalPages: Math.ceil(totalElements / query.size),
      },
    )
  } catch (error) {
    return handleRouteError(error)
  }
}
