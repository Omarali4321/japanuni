import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'JapanUni API',
  description: 'Next.js API foundation for JapanUni',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
