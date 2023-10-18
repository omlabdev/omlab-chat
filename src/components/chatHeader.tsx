import Image from 'next/image'

import { MouseEventHandler } from 'react'

import { useStoreContext } from '@/context/store'

import { Chat as ChatInterface } from '@/models/chat'

import Close from './icons/close'

export default function ChatHeader({ chat, onCloseHandler }: { chat: ChatInterface, onCloseHandler?: MouseEventHandler<HTMLButtonElement> }) {
  const { status } = useStoreContext()

  return (
    <header className="theme widget-header">
      {(chat.avatar) && (
        <span className="message__img-wrapper">
          <Image className="message__img" src={chat.avatar} alt="" height={35} width={35} />
        </span>
      )}
      <div className="widget-header__content">
        <h1 className="widget-header__title">
          {chat.name}
        </h1>
        <span className={`widget-header__subtitle ${status === 'typing' ? 'typing' : ''}`}>
          {(status === 'idle') && 'Online'}
          {(status === 'typing') && 'Typing...'}
        </span>
      </div>
      {(onCloseHandler) && (
        <button type="button" className="widget-header__close" title="Close" onClick={onCloseHandler}>
          <Close height={25} width={25} />
        </button>
      )}
    </header>
  )
}