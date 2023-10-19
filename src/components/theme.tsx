import { Chat } from '@/models/chat'

async function loadFontFace(fontFace: FontFace) {
  const loadedFont = await fontFace.load()
  document.fonts.add(loadedFont)
}

export default function Theme({ chat }: { chat?: Chat }) {
  if (!chat) return null
  if (chat.fontConfig?.family) loadFontFace(new FontFace(chat.name, `url("${chat.fontConfig.family}")`, { display: 'swap', style: 'normal', weight: 'normal' }))
  return (
    <>
      {chat.colors?.main && (<style>{`.theme{--color-main:${chat.colors.main}}`}</style>)}
      {chat.colors?.background && (<style>{`.theme{--color-background:${chat.colors.background}}`}</style>)}
      {chat.fontConfig?.family && (<style>{`.theme{--font-family-text:'${chat.name}'}`}</style>)}
      {chat.fontConfig?.size && (<style>{`.theme{--font-size:${chat.fontConfig.size}px}`}</style>)}
      {chat.fontConfig?.height && (<style>{`.theme{--line-height:${chat.fontConfig.height}px}`}</style>)}
      {chat.fontConfig?.spacing && (<style>{`.theme{--letter-spacing:${chat.fontConfig.spacing}px}`}</style>)}
      {chat.fontConfig?.color && (<style>{`.theme{--font-color:${chat.fontConfig.color}}`}</style>)}
    </>
  )
}