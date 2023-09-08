import '../styles/_index.scss'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Om Lab GPT',
  description: '',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
