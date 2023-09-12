import Script from 'next/script'

import Database from '@/services/database.service'

import Chat, { Chat as ChatInteface } from '@/models/chat'

export default async function Store() {
  await Database.connect()
  const chat = await Chat.findOne().lean<ChatInteface>().exec()

  if (!chat) return null
  
  return (
    <main className="container">
      <Script src="/embed.js" data-chat-id={chat.chatId} />
      <h1 className="title">
        Om Lab GPT | Demo - {chat.name}
      </h1>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus, corrupti laborum? Est, quasi at quos sequi vel, aliquid hic ad iste maiores provident necessitatibus harum autem eveniet ratione repellat explicabo?
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus, corrupti laborum? Est, quasi at quos sequi vel, aliquid hic ad iste maiores provident necessitatibus harum autem eveniet ratione repellat explicabo?
      </p>
    </main>
  )
}