import { getScholarships } from '@/lib/data'
import ScholarshipsContent from './scholarships-content'

export default function Page() {
  const scholarships = getScholarships() ?? []
  return <ScholarshipsContent initialScholarships={scholarships} />
}
