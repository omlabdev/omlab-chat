'use client'

import { useCallback, useEffect, useRef } from 'react'

export default function Modal({ children, open, onCloseHandler }: { children: React.ReactNode, open?: boolean, onCloseHandler?: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)

  const toggle = useCallback((show: boolean) => {
    if (show) dialog.current?.showModal()
    else dialog.current?.close()
  },  [])

  useEffect(() => {
    dialog.current?.addEventListener('close', () => onCloseHandler?.())
  }, [onCloseHandler])

  useEffect(() => toggle(!!open), [open, toggle])

  return (
    <dialog ref={dialog}>
      {children}
    </dialog>
  )
}