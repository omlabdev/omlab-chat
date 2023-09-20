import Database from '@/services/database.service'

import Chat, { Chat as ChatInteface } from '@/models/chat'

import StoreDemo from '@/components/storeDemo'

export default async function Store() {
  await Database.connect()
  const chats = await Chat.find().select('-_id').lean<ChatInteface[]>().exec()
  
  return (
    <main className="store">
      <h1 className="title">
        Om Lab GPT | Demo
      </h1>
      <StoreDemo chats={chats} />
    </main>
  )
}