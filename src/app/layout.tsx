import '../styles/_index.scss'

import type { Metadata } from 'next'

import { getServerSession } from 'next-auth'

import { SessionProvider } from '@/context/session'

import { authOptions } from './api/auth/[...nextauth]/route'

export const metadata: Metadata = {
  title: 'Om Lab GPT',
  description: '',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
