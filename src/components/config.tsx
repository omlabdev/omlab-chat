'use client'

import Image from 'next/image'

import { ChangeEvent, FormEvent, useEffect, useState } from 'react'

import { ChatUpdateValues, MediaImage } from '@/types'

import { Chat } from '@/models/chat'

import { getImageUrl } from '@/helpers'

import { functions } from '@/services/functions.service'

import { updateChat } from '@/api'

import Theme from './theme'
import Modal from './modal'
import MediaGallery from './mediaGallery'

import Copy from './icons/copy'
import Close from './icons/close'

declare type ValuesKeys = keyof ChatUpdateValues

const emptyValues: ChatUpdateValues = {name: '', font: '', background: '', accent: '', avatar: '', functions: [] }

export default function Config({ chat, onUpdateHandler }: { chat?: Chat, onUpdateHandler?: () => void }) {
  const [mediaModalOpen, setMediaModalOpen] = useState(false)
  const [confirmation, setConfirmation] = useState(false)
  const [values, setValues] = useState<ChatUpdateValues>(emptyValues)

  useEffect(() => {
    if (!chat) return
    setValues({
      name: chat.name,
      font: chat.font,
      background: chat.colors?.background,
      accent: chat.colors?.main,
      avatar: chat.avatar,
      functions: chat.functions,
    })
  }, [chat])

  const script = `<script src="https://chat.omlabdev.com/api/embed" data-chat-id="${chat?.chatId}" async defer></script>`

  function copy() {
    navigator?.clipboard?.writeText(script)
    setConfirmation(true)
    setTimeout(() => setConfirmation(false), 2000);
  }

  function setValue(key: ValuesKeys, value: string) {
    setValues((currentValues) => ({ ...currentValues, [key]: value }))
  }
  
  function setFunctions(event: ChangeEvent<HTMLSelectElement>) {
    const { options } = event.target
    const functions = Array.from(options).filter((option) => option.selected).map((option) => option.value)
    setValues((currentValues) => ({ ...currentValues, functions }))
  }

  function onImageSelected(image: MediaImage) {
    const url = getImageUrl(image)
    setValue('avatar', url)
    setMediaModalOpen(false)
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!chat) return
    const response = await updateChat(chat?.chatId, values)
    if (!response.success) throw ''
    onUpdateHandler?.()
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
        <div className="form-group">
          <label htmlFor="functions" className="form-label">
            Functions
          </label>
          <select className="form-input" multiple={true} onChange={setFunctions} value={values.functions}>
            {functions.map((fn, index) => (
              <option key={index} className="form-option" value={fn.name}>
                {fn.name}
              </option>
            ))}
          </select>
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
            <button type="button" className="form-image-frame" onClick={() => setMediaModalOpen(true)}>
              <div className="form-image-wrapper">
                {(values.avatar) && (<Image className="form-image" src={values.avatar} height={100} width={100} alt="" />)}
                {(!values.avatar) && ('Select an image')}
              </div>
            </button>
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

      <Modal open={mediaModalOpen} onCloseHandler={() => setMediaModalOpen(false)}>
        <div className="media-gallery-header">
          <h2 className="media-gallery-title">
            Image Gallery
          </h2>
          <p className="media-gallery-subtitle">
            Select an image
          </p>
          <button type="button" className="media-gallery-close" title="Close" onClick={() => setMediaModalOpen(false)}>
            <Close />
          </button>
        </div>
        <MediaGallery onImageSelected={onImageSelected} />
      </Modal>
    </div>
  )
}