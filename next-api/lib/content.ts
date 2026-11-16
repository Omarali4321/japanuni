import type { Prisma } from '@prisma/client'

export const scholarshipInclude = {
  university: { select: { id: true, name: true } },
} satisfies Prisma.ScholarshipInclude

export function scholarshipDto(scholarship: Prisma.ScholarshipGetPayload<{
  include: typeof scholarshipInclude
}>) {
  return {
    id: Number(scholarship.id),
    title: scholarship.title,
    description: scholarship.description,
    amountYearly: scholarship.amountYearly?.toString() ?? null,
    coverage: scholarship.coverage,
    deadlineMonth: scholarship.deadlineMonth,
    eligibility: scholarship.eligibility,
    universityId: scholarship.university ? Number(scholarship.university.id) : null,
    universityName: scholarship.university?.name ?? null,
  }
}

export function cityDto(city: {
  id: bigint
  name: string
  description: string | null
  costOfLivingMonthly: number | null
  imageUrl: string | null
}) {
  return {
    id: Number(city.id),
    name: city.name,
    description: city.description,
    costOfLivingMonthly: city.costOfLivingMonthly,
    imageUrl: city.imageUrl,
  }
}

export function admissionGuideDto(guide: {
  id: bigint
  title: string
  content: string
  category: string | null
}) {
  return {
    id: Number(guide.id),
    title: guide.title,
    content: guide.content,
    category: guide.category,
    visaType: null,
    imageUrl: null,
  }
}

export function visaGuideDto(guide: {
  id: bigint
  title: string
  content: string
  visaType: string | null
}) {
  return {
    id: Number(guide.id),
    title: guide.title,
    content: guide.content,
    category: null,
    visaType: guide.visaType,
    imageUrl: null,
  }
}

export function studentLifeDto(article: {
  id: bigint
  title: string
  content: string
  category: string | null
  imageUrl: string | null
}) {
  return {
    id: Number(article.id),
    title: article.title,
    content: article.content,
    category: article.category,
    visaType: null,
    imageUrl: article.imageUrl,
  }
}
