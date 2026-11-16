import type { Prisma } from '@prisma/client'
import { prisma } from './prisma'

type UniversityRecord = Prisma.UniversityGetPayload<{
  include: {
    city: true
    images: true
    reviews: { select: { rating: true } }
  }
}>

export function universityWhere(filters: {
  search?: string
  cityId?: bigint
  maxTuition?: Prisma.Decimal
  minRanking?: number
  institutionType?: string
  mediumOfInstruction?: string
  preArrivalAdmission?: string
  intake?: string
}) {
  const and: Prisma.UniversityWhereInput[] = []

  if (filters.search) {
    and.push({
      OR: [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { programs: { contains: filters.search, mode: 'insensitive' } },
        { faculty: { contains: filters.search, mode: 'insensitive' } },
        { degree: { contains: filters.search, mode: 'insensitive' } },
        { majorSpeciality: { contains: filters.search, mode: 'insensitive' } },
      ],
    })
  }

  if (filters.cityId !== undefined) and.push({ cityId: filters.cityId })
  if (filters.maxTuition !== undefined) {
    and.push({ tuitionFeeYearly: { lte: filters.maxTuition } })
  }
  if (filters.minRanking !== undefined) {
    and.push({ ranking: { gte: filters.minRanking } })
  }
  if (filters.institutionType) {
    and.push({ institutionType: { contains: filters.institutionType, mode: 'insensitive' } })
  }
  if (filters.mediumOfInstruction) {
    and.push({
      mediumOfInstruction: { contains: filters.mediumOfInstruction, mode: 'insensitive' },
    })
  }
  if (filters.preArrivalAdmission) {
    and.push({
      preArrivalAdmission: { contains: filters.preArrivalAdmission, mode: 'insensitive' },
    })
  }
  if (filters.intake) {
    and.push({ intake: { contains: filters.intake, mode: 'insensitive' } })
  }

  return and.length ? { AND: and } : {}
}

export const universityInclude = {
  city: true,
  images: true,
  reviews: { select: { rating: true } },
} satisfies Prisma.UniversityInclude

export function toUniversityDto(university: UniversityRecord) {
  const ratings = university.reviews.map((review) => review.rating)
  const averageRating = ratings.length
    ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
    : null

  return {
    id: Number(university.id),
    name: university.name,
    description: university.description,
    ranking: university.ranking,
    tuitionFeeYearly: university.tuitionFeeYearly?.toString() ?? null,
    ieltsRequirement: university.ieltsRequirement,
    toeflRequirement: university.toeflRequirement,
    jlptRequirement: university.jlptRequirement,
    acceptanceRate: university.acceptanceRate,
    programs: university.programs,
    dormitoryInfo: university.dormitoryInfo,
    websiteUrl: university.websiteUrl,
    images: university.images.map((image) => image.imageUrl),
    cityName: university.city?.name ?? null,
    cityId: university.city ? Number(university.city.id) : null,
    costOfLivingMonthly: university.city?.costOfLivingMonthly ?? null,
    favorited: false,
    averageRating,
    reviewCount: ratings.length,
    sourceDataset: university.sourceDataset,
    sourceKey: university.sourceKey,
    sourceUrl: university.sourceUrl,
    sourceRowCount: university.sourceRowCount,
    institutionType: university.institutionType,
    faculty: university.faculty,
    degree: university.degree,
    intake: university.intake,
    mediumOfInstruction: university.mediumOfInstruction,
    preArrivalAdmission: university.preArrivalAdmission,
    majorSpeciality: university.majorSpeciality,
  }
}

export async function findUniversity(id: bigint) {
  return prisma.university.findUnique({
    where: { id },
    include: universityInclude,
  })
}
