import Database from '@/services/database.service'

import Chat, { Chat as ChatInterface } from '@/models/chat'

import AdminChat from '@/components/adminChat'

export default async function Admin() {
  const title = 'Admin'

  await Database.connect()
  const chats: ChatInterface[] = await Chat.find().select('-_id').lean<ChatInterface[]>().exec()

  return (
    <main className="container page-admin">
      <h1 className="title">
        Om Lab GPT | {title}
      </h1>
      <AdminChat chats={chats} />
    </main>
  )
}