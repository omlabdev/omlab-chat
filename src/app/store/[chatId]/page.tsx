import Database from '@/services/database.service'

import Chat, { Chat as ChatInteface } from '@/models/chat'

import StoreDemo from '@/components/storeDemo'

export default async function Store({ params }: { params: { chatId: string } }) {
  const { chatId }= params
  await Database.connect()
  const chats = await Chat.find().select('-_id').lean<ChatInteface[]>().exec()
  const chat = chats.find((chat) => chat.chatId === chatId)
  
  if (!chat) return null
  
  return (
    <main className="store">
      <h1 className="title">
        Om Lab GPT | Demo
      </h1>
      <StoreDemo chats={chats} chat={chat} />
    </main>
  )
}