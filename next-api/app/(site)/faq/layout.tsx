import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ | JapanUni',
  description: 'Frequently asked questions about studying in Japan, JapanUni features, and more.',
}

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children
}