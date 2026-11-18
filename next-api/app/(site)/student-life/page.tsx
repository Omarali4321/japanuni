import { getGuides } from '@/lib/data'
import { ContentList } from '@/components/content-list'

export default function Page() {
  const guides = getGuides('student-life') ?? []
  return <ContentList items={guides} title="Student Life in Japan" description="What to expect as an international student." kind="student" />
}
