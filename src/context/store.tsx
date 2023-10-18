'use client'

import { Dispatch, SetStateAction, createContext, useContext, useState } from 'react'

import { ChatStatus } from '@/types'

declare type ContextProps = {
  setStatus: Dispatch<SetStateAction<ChatStatus>>
  status: ChatStatus
}

const StoreContext = createContext<ContextProps>({ setStatus: () => null, status: 'idle' })
 
export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<ChatStatus>('idle')

  const value = { status, setStatus }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export const useStoreContext = () => useContext(StoreContext)