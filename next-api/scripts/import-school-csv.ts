import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import iconv from 'iconv-lite'
import { parse } from 'csv-parse/sync'
import { PrismaClient } from '@prisma/client'

type CsvRow = Record<string, string>

const DATASET = 'School_Search_Result.csv'
const headers = {
  major1: 'Major of Study 1',
  major2: 'Major of Study 2',
  school: 'School Name',
  type: 'Type',
  faculty: 'Faculty',
  url: 'Web site(faculty/department)',
  speciality: 'Major /Speciality  Division',
  degree: 'Degree',
  begins1: 'Begins in(1)',
  begins2: 'Begins in(2)',
  medium: 'Medium of Instruction',
  preArrival: 'Pre-arrival admission',
} as const

const prisma = new PrismaClient()

function normalize(value: string | undefined) {
  return (value ?? '').replace(/\s+/g, ' ').trim()
}

function uniqueValues(values: string[]) {
  return [...new Set(values.map(normalize).filter(Boolean))]
}

function joinValues(values: string[], separator = ' | ') {
  return uniqueValues(values).join(separator) || null
}

function sourceKey(schoolName: string) {
  return normalize(schoolName).toLocaleLowerCase('en-US')
    .normalize('NFKC')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-|-$/g, '')
}

function rowHash(rows: CsvRow[]) {
  return createHash('sha256')
    .update(JSON.stringify(rows))
    .digest('hex')
}

function getArg(name: string) {
  const index = process.argv.indexOf(name)
  return index >= 0 ? process.argv[index + 1] : undefined
}

async function main() {
  const file = getArg('--file')
  if (!file) {
    throw new Error('Usage: npm run import:schools -- --file /path/School_Search_Result.csv [--apply]')
  }

  const input = await readFile(file)
  const text = iconv.decode(input, 'cp932')
  const rows = parse(text, {
    columns: true,
    skip_empty_lines: true,
    bom: true,
    relax_column_count: true,
    trim: false,
  }) as CsvRow[]

  const grouped = new Map<string, CsvRow[]>()
  for (const row of rows) {
    const school = normalize(row[headers.school])
    if (!school) continue
    const key = sourceKey(school)
    grouped.set(key, [...(grouped.get(key) ?? []), row])
  }

  const records = [...grouped.entries()].map(([key, schoolRows]) => {
    const first = schoolRows[0]
    const majorValues = schoolRows.flatMap((row) => [
      row[headers.major1],
      row[headers.major2],
      row[headers.speciality],
    ])
    const urls = uniqueValues(schoolRows.map((row) => row[headers.url]))

    return {
      name: normalize(first[headers.school]),
      programs: joinValues(majorValues),
      websiteUrl: urls[0]?.slice(0, 500) || null,
      sourceDataset: DATASET,
      sourceKey: key,
      sourceUrl: urls[0]?.slice(0, 1000) || null,
      institutionType: joinValues(schoolRows.map((row) => row[headers.type])),
      faculty: joinValues(schoolRows.map((row) => row[headers.faculty])),
      degree: joinValues(schoolRows.map((row) => row[headers.degree])),
      intake: joinValues(schoolRows.flatMap((row) => [
        row[headers.begins1],
        row[headers.begins2],
      ])),
      mediumOfInstruction: joinValues(schoolRows.map((row) => row[headers.medium])),
      preArrivalAdmission: joinValues(schoolRows.map((row) => row[headers.preArrival])),
      majorSpeciality: joinValues(schoolRows.map((row) => row[headers.speciality])),
      sourceRowHash: rowHash(schoolRows),
      sourceRowCount: schoolRows.length,
    }
  })

  const missingHeaders = Object.values(headers).filter((header) => !rows.some((row) => header in row))
  if (missingHeaders.length) {
    throw new Error(`Missing expected CSV headers: ${missingHeaders.join(', ')}`)
  }

  console.log(JSON.stringify({
    encoding: 'cp932',
    rowsRead: rows.length,
    schools: records.length,
    duplicateRowsCollapsed: rows.length - records.length,
    preview: records.slice(0, 3),
  }, null, 2))

  if (!process.argv.includes('--apply')) {
    console.log('Dry run only. Add --apply only in an explicitly approved database-write step.')
    return
  }

  for (const record of records) {
    await prisma.university.upsert({
      where: { sourceKey: record.sourceKey },
      create: record,
      update: record,
    })
  }

  console.log(`Upserted ${records.length} universities from ${DATASET}.`)
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
