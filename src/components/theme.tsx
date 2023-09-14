import { Chat } from '@/models/chat'

export default function Theme({ chat }: { chat?: Chat }) {
  if (!chat) return null
  return (
    <>
      {chat.colors?.main && (<style>{`.theme{--color-main:${chat.colors.main}}`}</style>)}
      {chat.colors?.background && (<style>{`.theme{--color-background:${chat.colors.background}}`}</style>)}
      {chat.font && (<style>{`.theme{--font-family-text:${chat.font}}`}</style>)}
    </>
  )
}