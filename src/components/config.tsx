'use client'

import Image from 'next/image'
import Link from 'next/link'

import { ChangeEvent, FormEvent, useEffect, useState } from 'react'

import { ChatUpdateValues, FontConfig, MediaImage, WidgetStyle } from '@/types'

import { Chat } from '@/models/chat'

import { getImageUrl } from '@/helpers'

import { functions } from '@/services/functions.service'

import { updateChat } from '@/api'

import Theme from './theme'
import Modal from './modal'
import MediaGallery from './mediaGallery'
import SpinnerLoader from './spinnerLoader'

import Copy from './icons/copy'
import Close from './icons/close'
import Trash from './icons/trash'
import Add from './icons/add'

declare type ValuesKeys = keyof ChatUpdateValues
declare type FontValuesKeys = keyof FontConfig

const emptyValues: ChatUpdateValues = { name: '', fontConfig: { size: 16, height: 16, spacing: .5, color: '#fff'  }, background: '', accent: '', avatar: '', functions: [], users: [] }

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

export default function Config({ chat, onUpdateHandler }: { chat?: Chat, onUpdateHandler?: () => void }) {
  const [mediaModalOpen, setMediaModalOpen] = useState(false)
  const [userModalOpen, setUserModalOpen] = useState(false)
  const [confirmation, setConfirmation] = useState(false)
  const [user, setUser] = useState('')
  const [loading, setLoading] = useState(false)
  const [script, setScript] = useState<string[]>([])
  const [widgetStyle, setWidgetStyle] = useState<WidgetStyle>('floating')
  const [values, setValues] = useState<ChatUpdateValues>(emptyValues)

  useEffect(() => {
    if (!chat) return
    setValues({
      name: chat.name,
      siteUrl: chat.siteUrl,
      fontConfig: chat.fontConfig,
      background: chat.colors?.background,
      accent: chat.colors?.main,
      avatar: chat.avatar,
      functions: chat.functions,
      users: chat.users ?? [],
    })
  }, [chat])

  useEffect(() => {
    let code = []
    if (widgetStyle === 'inline') code.push('<div id="omlab-chat-container></div>')
    code.push(`<script src="${siteUrl}/api/embed" data-chat-id="${chat?.chatId}" data-widget-style="${widgetStyle}" async defer></script>`)
    setScript(code)
  }, [widgetStyle, chat])


  function copy() {
    navigator?.clipboard?.writeText(script.join('\n'))
    setConfirmation(true)
    setTimeout(() => setConfirmation(false), 2000);
  }

  function setValue(key: ValuesKeys, value: string) {
    setValues((currentValues) => ({ ...currentValues, [key]: value }))
  }

  function setFontValue(key: FontValuesKeys, value: string) {
    setValues((currentValues) => ({ ...currentValues, fontConfig: { ...currentValues.fontConfig, [key]: value} }))
  }

  function saveUser() {
    setValues((currentValues) => {
      const users = [...currentValues.users]
      users.push(user)
      console.log(users)
      return { ...currentValues, users }
    })
    setUserModalOpen(false)
    setUser('')
  }

  function removeUser(index: number) {
    setValues((currentValues) => {
      const users = [...currentValues.users]
      users.splice(index, 1)
      return { ...currentValues, users }
    })
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
    setLoading(true)
    try {
      const response = await updateChat(chat?.chatId, values)
      if (!response.success) throw ''
    } catch (error) {
      console.error(error)
      alert('There was an error saving the config.')
    } finally {
      setLoading(false)
    }
    onUpdateHandler?.()
  }

  return (
    <div className="config theme">
      <SpinnerLoader active={loading} />
      {(chat) && (<Theme chat={{ ...values, colors: { main: values.accent, background: values.background }, chatId: chat.chatId }} />)}
      <form className="config-form" noValidate onSubmit={submit}>
        <div className="form-row">
          <div className="form-group flex-grow-0">
            <label htmlFor="avatar" className="form-label text-center">
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
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input type="text" className="form-input" id="name" value={values.name ?? ''} onChange={(event) => setValue('name', event.target.value)} />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="siteUrl" className="form-label">
            Website URL
          </label>
          <input type="url" className="form-input" id="siteUrl" value={values.siteUrl ?? ''} onChange={(event) => setValue('siteUrl', event.target.value)} />
        </div>
        <div className="form-group form-group--border">
          <label className="form-label">
            <strong>Font</strong>
          </label>
          <div className="form-group">
            <span className="form-label">
              Sample
            </span>
            <span className="form-sample-text theme">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quis quo, tempore nulla natus doloremque, voluptas nostrum cum iusto minima ipsam error qui culpa impedit? Saepe consequuntur unde perspiciatis eveniet laboriosam.
            </span>
          </div>
          <div className="form-group">
            <label htmlFor="font" className="form-label">
              Font Family
            </label>
            <input type="text" className="form-input" id="font" value={values.fontConfig?.family ?? ''} onChange={(event) => setFontValue('family', event.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="font-size" className="form-label">
              Font Size (px)
            </label>
            <input type="number" className="form-input" id="font-size" value={values.fontConfig?.size ?? ''} onChange={(event) => setFontValue('size', event.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="font-line-height" className="form-label">
              Line height (px)
            </label>
            <input type="number" className="form-input" id="font-line-height" value={values.fontConfig?.height ?? ''} onChange={(event) => setFontValue('height', event.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="font-letter-spacing" className="form-label">
              Letter spacing (px)
            </label>
            <input type="number" className="form-input" id="font-letter-spacing" value={values.fontConfig?.spacing ?? ''} onChange={(event) => setFontValue('spacing', event.target.value)} />
          </div>
        </div>
        <div className="form-group form-group--border">
          <label className="form-label">
            <strong>Colors</strong>
          </label>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="color-main" className="form-label text-center">
                Accent Color
              </label>
              <input type="color" className="color-input" id="color-main" value={values.accent ?? ''} onChange={(event) => setValue('accent', event.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="color-bg" className="form-label text-center">
                Background Color
              </label>
              <input type="color" className="color-input" id="color-bg" value={values.background ?? ''} onChange={(event) => setValue('background', event.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="color-font" className="form-label text-center">
                Font Color
              </label>
              <input type="color" className="color-input" id="color-font" value={values.fontConfig?.color ?? ''} onChange={(event) => setFontValue('color', event.target.value)} />
            </div>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="functions" className="form-label">
            Functions
          </label>
          <select className="form-input" multiple={true} onChange={setFunctions} value={values.functions}>
            {functions.map((fn, index) => (
              <option key={index} className="form-option" value={fn.chatFunction.name}>
                {fn.chatFunction.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group form-group--border">
          <label className="form-label">
            <strong>Site Demo</strong>
          </label>
          <div className="demo-link-wrapper">
            <Link className="demo-link" href={`/demo/${chat?.chatId}`} target="_blank" >
              {`${siteUrl}/demo/${chat?.chatId}`}
            </Link>
          </div>
          <label className="form-label">
            Users
            <button className="btn-icon" type="button" title="Add user" onClick={() => setUserModalOpen(true)}>
              <Add />
            </button>
          </label>
          <ul className="form-users">
            {values.users.map((user, index) => (
              <li className="form-user" key={index}>
                {user}
                <button className="btn-icon" type="button" title="Remove user" onClick={() => removeUser(index)}>
                  <Trash />
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <label className="form-label">
            Code Snippet
          </label>
          <div className="radio-group radio-group--admin">
            <div className="radio-wrapper">
              <input className="radio-input" id="radio-style-floating" type="radio" checked={widgetStyle === 'floating'} onChange={() => setWidgetStyle('floating')} />
              <label className="radio-label" htmlFor="radio-style-floating">
                Floating
              </label>
            </div>
            <div className="radio-wrapper">
              <input className="radio-input" id="radio-style-inline" type="radio" checked={widgetStyle === 'inline'} onChange={() => setWidgetStyle('inline')} />
              <label className="radio-label" htmlFor="radio-style-inline">
                Inline
              </label>
            </div>
          </div>
          <div className="code-snippet-wrapper">
            <div className="code-snippet">
              <code className="code-snippet-content">
                {script.join('\n')}
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

      <Modal open={userModalOpen} onCloseHandler={() => setUserModalOpen(false)}>
        <div className="form-group">
          <label htmlFor="userEmail" className="form-label">
            Email
          </label>
          <input type="email" className="form-input" id="userEmail" value={user ?? ''} onChange={(event) => setUser(event.target.value)} />
        </div>
        <br />
        <div className="modal__footer">
          <button type="button" className="modal__footer__btn modal__footer__btn--danger" onClick={() => setUserModalOpen(false)}>
            Cancel
          </button>
          <button type="button" className="modal__footer__btn" onClick={() => saveUser()}>
            Save
          </button>
        </div>
      </Modal>

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