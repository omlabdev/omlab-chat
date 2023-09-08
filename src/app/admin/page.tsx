import Database from '@/services/database.service'

import chat, { Chat } from '@/models/chat'


import AdminChat from '@/components/adminChat'

export default async function Admin() {
  const title = 'Admin'

  await Database.connect()
  const chats: Chat[] = (await chat.find().exec()).map((chat) => ({ chatId: chat.chatId, name: chat.name }))

  return (
    <main className="container page-admin">
      <h1 className="title">
        Om Lab GPT | {title}
      </h1>
      <AdminChat chats={chats} />
    </main>
  )
}