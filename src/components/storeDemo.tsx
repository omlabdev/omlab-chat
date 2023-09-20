'use client'

import Script from 'next/script'

import { Chat as ChatInterface } from '@/models/chat'

import ChatSelect from './chatSelect'

export default function StoreDemo({ chats, chat }: { chats: ChatInterface[], chat?: ChatInterface }) {
  function selectChat(chatId: string) {
    const chat = chats.find((chat) => chat.chatId === chatId)
    if (chat) history.pushState(null, '', `/admin/store/${chat.chatId}`)
    window.location = window.location
  }

  const dummyContent = []
  for (let index = 0; index < 10; index++) {
    dummyContent.push(<p key={index}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus, corrupti laborum? Est, quasi at quos sequi vel, aliquid hic ad iste maiores provident necessitatibus harum autem eveniet ratione repellat explicabo?</p>)
    
  }
  
  return (
    <div className="container">
      <ChatSelect chats={chats} value={chat?.chatId} onChange={selectChat} allChats={false} />
      <div>
        <hr />
      </div>
      {(chat) && (
        <div className="demo-content">
          <Script src="/embed.js" data-chat-id={chat.chatId} />
          <h1 className="title">
            {chat?.name}
          </h1>
          {dummyContent}
        </div>
      )}
    </div>
  )
}