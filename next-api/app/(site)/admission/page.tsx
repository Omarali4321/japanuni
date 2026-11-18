import { getGuides } from '@/lib/data'
import { ContentList } from '@/components/content-list'

export default function Page() {
  const guides = getGuides('admission') ?? []
  return <ContentList items={guides} title="Admission Guide" description="From choosing a program to submitting your application." kind="admission" />
}
