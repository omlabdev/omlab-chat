import Database from '@/services/database.service'

import Chat, { Chat as ChatInteface } from '@/models/chat'

import StoreDemo from '@/components/storeDemo'
import Chevron from '@/components/icons/chevron'

export default async function StoreChat({ params }: { params: { chatId: string } }) {
  const { chatId }= params
  await Database.connect()
  const chats = await Chat.find().select('-_id').lean<ChatInteface[]>().exec()
  const chat = chats.find((chat) => chat.chatId === chatId)
  
  if (!chat) return null
  
  return (
    <main className="store">
      <h1 className="title admin__title">
        <a className="admin__back" href="/admin">
          <Chevron orientation="left" height={30} width={30} />
        </a>
        Om Lab GPT | Demo: {chat.name}
      </h1>
      <StoreDemo chats={chats} chat={chat} />
    </main>
  )
}