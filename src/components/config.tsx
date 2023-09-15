import Image from 'next/image'

import { FormEvent, useEffect, useState } from 'react'

import { ChatUpdateValues } from '@/types'

import { Chat } from '@/models/chat'

import Theme from './theme'

import Copy from './icons/copy'
import { updateChat } from '@/api'

declare type ValuesKeys = keyof ChatUpdateValues

export default function Config({ chat }: { chat?: Chat }) {
  const [values, setValues] = useState<ChatUpdateValues>({ name: '', font: '', background: '', accent: '', avatar: '' })
  const [confirmation, setConfirmation] = useState(false)

  useEffect(() => {
    if (!chat) return
    setValues({ name: chat.name, font: chat.font, background: chat.colors?.background, accent: chat.colors?.main, avatar: chat.avatar })
  }, [chat])

  const script = `<script src="https://chat.omlab.dev/embed.js" data-chat-id="${chat?.chatId}"></script>`

  function copy() {
    navigator?.clipboard?.writeText(script)
    setConfirmation(true)
    setTimeout(() => setConfirmation(false), 2000);
  }

  function setValue(key: ValuesKeys, value: string) {
    setValues((currentValues) => ({ ...currentValues, [key]: value }))
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!chat) return
    const response = await updateChat(chat?.chatId, values)
    if (!response.success) throw ''
    // TODO: Make this refresh more graceful
    window.location = window.location
  }

  return (
    <div className="config theme">
      {(chat) && (<Theme chat={{ ...values, colors: { main: values.accent, background: values.background }, chatId: chat.chatId }} />)}
      <form className="config-form" noValidate onSubmit={submit}>
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input type="text" className="form-input" id="name" value={values.name ?? ''} onChange={(event) => setValue('name', event.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="font" className="form-label">
            Font
          </label>
          <input type="text" className="form-input" id="font" value={values.font ?? ''} onChange={(event) => setValue('font', event.target.value)} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="color-main" className="form-label">
              Accent Color
            </label>
            <input type="color" className="color-input" id="color-main" value={values.accent ?? ''} onChange={(event) => setValue('accent', event.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="color-bg" className="form-label">
              Background Color
            </label>
            <input type="color" className="color-input" id="color-bg" value={values.background ?? ''} onChange={(event) => setValue('background', event.target.value)} />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="avatar" className="form-label">
            Avatar
          </label>
          <div className="form-image-input-wrapper">
            <div className="form-image-frame">
              <div className="form-image-wrapper">
                {(values.avatar) && (<Image className="form-image" src={values.avatar} height={100} width={100} alt="" />)}
              </div>
            </div>
            <input type="file" className="form-input" id="avatar" onChange={(event) => setValue('avatar', event.target.value)} />
          </div>
        </div>
        <div>
          <label className="form-label">
            Code Snippet
          </label>
          <div className="code-snippet-wrapper">
            <div className="code-snippet">
              <code className="code-snippet-content">
                {script}
              </code>
            </div>
            <button className="code-copy-btn" type="button" onClick={copy}>
              {(confirmation) && (<span className="code-copy-btn__confirmation">Code copied!</span>)}
              <Copy height={30} width={30} />
            </button>
          </div>
        </div>
        <div className="form-group">
          <button className="config-submit-btn" type="submit">
            Save
          </button>
        </div>
      </form>
    </div>
  )
}