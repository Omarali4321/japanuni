import { NextRequest, NextResponse } from 'next/server'

const guides = [
  { kind: 'admission', title: 'Admission Requirements', href: '/admission' },
  { kind: 'admission', title: 'Application Timeline', href: '/admission' },
  { kind: 'admission', title: 'Document Checklist', href: '/admission' },
  { kind: 'admission', title: 'Entrance Exams', href: '/admission' },
  { kind: 'admission', title: 'Interview Tips', href: '/admission' },
  { kind: 'visa', title: 'Student Visa (COE)', href: '/visa' },
  { kind: 'visa', title: 'Part-time Work Permit', href: '/visa' },
  { kind: 'visa', title: 'Visa Renewal', href: '/visa' },
  { kind: 'visa', title: 'Dependent Visa', href: '/visa' },
  { kind: 'visa', title: 'Visa FAQ', href: '/visa' },
  { kind: 'student', title: 'Housing Guide', href: '/student-life' },
  { kind: 'student', title: 'Cost of Living', href: '/student-life' },
  { kind: 'student', title: 'Part-time Jobs', href: '/student-life' },
  { kind: 'student', title: 'Healthcare', href: '/student-life' },
  { kind: 'student', title: 'Cultural Tips', href: '/student-life' },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') || ''
  const size = parseInt(searchParams.get('size') || '10', 10)

  if (!q.trim() || q.length < 2) {
    return NextResponse.json({ data: [] })
  }

  const query = q.toLowerCase()
  const results = guides
    .filter((g) => g.title.toLowerCase().includes(query) || g.kind.includes(query))
    .slice(0, size)
    .map((g) => ({ title: g.title, href: g.href, kind: g.kind }))

  return NextResponse.json({ data: results })
}