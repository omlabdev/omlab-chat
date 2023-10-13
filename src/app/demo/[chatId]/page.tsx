import { notFound } from 'next/navigation'
import Script from 'next/script'

import { getServerSession } from 'next-auth'

import { authOptions } from '@/app/api/auth/[...nextauth]/route'

import Database from '@/services/database.service'

import Chat, { Chat as ChatInterface } from '@/models/chat'

import { isAdmin } from '@/helpers'

const { NEXT_PUBLIC_SITE_URL: siteUrl } = process.env

export default async function Demo({ params }: { params: { chatId: string } }) {
  const { chatId } = params
  const session = await getServerSession(authOptions)
  if ((!session) || (!session.user)) return null
  const { email } = session.user
  if (!email) return null
  await Database.connect()
  const chat = await Chat.findOne({ chatId }).lean<ChatInterface>().exec()
  if (!chat) return notFound()
  if ((!isAdmin(email)) && (!chat.users?.includes(email))) return notFound()
  if (!chat.siteUrl) return 'No site URL configured.'
  return (
    <>
      <iframe className="demo-iframe" src={chat.siteUrl} />
      <Script src={`${siteUrl}/api/embed`} data-chat-id={chat.chatId} data-widget-style="floating" />
    </>
  )
}