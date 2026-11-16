import { NextRequest } from 'next/server'
import { z } from 'zod'
import { handleRouteError, jsonData } from '../../../../lib/http'
import { prisma } from '../../../../lib/prisma'
import { toUniversityDto, universityInclude } from '../../../../lib/universities'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const schema = z.object({
  field: z.string().trim().max(200).optional(),
  budgetYearly: z.number().finite().nonnegative().nullable().optional(),
  ieltsScore: z.number().finite().min(0).max(9).nullable().optional(),
  jlptLevel: z.string().trim().max(10).nullable().optional(),
  cityId: z.number().int().positive().nullable().optional(),
})

const normalize = (value: string | null | undefined) => value?.trim().toLowerCase() || ''

function score(university: {
  id: bigint
  ranking: number | null
  programs: string | null
  tuitionFeeYearly: { toString(): string } | null
  ieltsRequirement: number | null
  jlptRequirement: string | null
  cityId: bigint | null
  city: { id: bigint } | null
  images: { imageUrl: string }[]
  reviews: { rating: number }[]
  name: string
  description: string | null
  websiteUrl: string | null
  dormitoryInfo: string | null
  toeflRequirement: number | null
  acceptanceRate: number | null
  cityName?: never
}, input: z.infer<typeof schema>) {
  let value = 35
  const reasons: string[] = []
  const gaps: string[] = []
  const programs = normalize(university.programs)
  const field = normalize(input.field)
  const tuition = university.tuitionFeeYearly ? Number(university.tuitionFeeYearly.toString()) : null
  if (input.budgetYearly != null && tuition != null) {
    if (input.budgetYearly >= tuition) { value += 20; reasons.push('Tuition fits your yearly budget.') }
    else { value -= 18; gaps.push('Tuition is above your yearly budget.') }
  }
  if (input.ieltsScore != null && university.ieltsRequirement != null) {
    if (input.ieltsScore >= university.ieltsRequirement) { value += 18; reasons.push('Your IELTS score meets the listed requirement.') }
    else if (input.ieltsScore + 0.5 >= university.ieltsRequirement) { value += 4; gaps.push('IELTS is close to the listed requirement.') }
    else { value -= 14; gaps.push('IELTS is below the listed requirement.') }
  }
  if (field) {
    const related = programs.includes(field) ||
      (field.includes('computer') && /(computer|engineering|science)/.test(programs)) ||
      (field.includes('business') && /(business|commerce|economics|management)/.test(programs)) ||
      (field.includes('medicine') && /(medicine|dentistry|life science)/.test(programs))
    if (related) { value += 22; reasons.push('Programs are related to your study interest.') }
    else { value -= 6; gaps.push('Programs may not directly match your study interest.') }
  }
  if (input.jlptLevel && university.jlptRequirement) {
    const rank = (level: string) => ({ n1: 1, n2: 2, n3: 3, n4: 4, n5: 5 }[normalize(level)] || 0)
    if (rank(input.jlptLevel) > 0 && rank(input.jlptLevel) <= rank(university.jlptRequirement)) { value += 10; reasons.push('Your JLPT level meets the listed requirement.') }
    else { value -= 6; gaps.push('JLPT may need improvement for Japanese-taught programs.') }
  }
  if (input.cityId != null && university.cityId != null) {
    if (BigInt(input.cityId) === university.cityId) { value += 8; reasons.push('Located in your preferred city.') }
    else value -= 2
  }
  if (university.ranking != null && university.ranking <= 70) { value += 6; reasons.push('Strong ranking among listed universities.') }
  value = Math.max(0, Math.min(100, value))
  return {
    university: toUniversityDto(university as never),
    score: value,
    fitLevel: value >= 78 ? 'Excellent fit' : value >= 60 ? 'Good fit' : value >= 42 ? 'Possible fit' : 'Stretch option',
    reasons,
    gaps,
  }
}

export async function POST(request: NextRequest) {
  try {
    const input = schema.parse(await request.json())
    const universities = await prisma.university.findMany({
      include: { ...universityInclude, reviews: { select: { rating: true } } },
    })
    const results = universities.map((university) => score(university, input))
      .sort((a, b) => b.score - a.score || (a.university.ranking ?? 999999) - (b.university.ranking ?? 999999))
      .slice(0, 5)
    return jsonData(results)
  } catch (error) {
    return handleRouteError(error)
  }
}
