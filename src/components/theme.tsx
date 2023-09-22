import { Chat } from '@/models/chat'

async function loadFontFace(fontFace: FontFace) {
  const loadedFont = await fontFace.load()
  document.fonts.add(loadedFont)
}

export default function Theme({ chat }: { chat?: Chat }) {
  if (!chat) return null
  if (chat.font) loadFontFace(new FontFace(chat.name, `url("${chat.font}")`, { display: 'swap', style: 'normal', weight: 'normal' }))
  return (
    <>
      {chat.colors?.main && (<style>{`.theme{--color-main:${chat.colors.main}}`}</style>)}
      {chat.colors?.background && (<style>{`.theme{--color-background:${chat.colors.background}}`}</style>)}
      {chat.font && (<style>{`.theme{--font-family-text:'${chat.name}'}`}</style>)}
    </>
  )
}