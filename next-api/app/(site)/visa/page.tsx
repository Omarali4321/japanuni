import { getGuides } from '@/lib/data'
import { ContentList } from '@/components/content-list'

export default function Page() {
  const guides = getGuides('visa') ?? []
  return <ContentList items={guides} title="Visa Guide" description="Student visa, COE, and part-time work permissions." kind="visa" />
}
