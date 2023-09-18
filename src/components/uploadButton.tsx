'use client'

import { generateComponents } from '@uploadthing/react'
import { UploadFileResponse } from 'uploadthing/client'

import { fileRouter } from '@/app/api/uploadthing/core'

const { UploadButton: UploadThingButton } = generateComponents<typeof fileRouter>()

export default function UploadButton({ onClientUploadComplete, onUploadError }: { onClientUploadComplete?: (res: UploadFileResponse[] | undefined) => void, onUploadError?: (error: Error) => void }) {
  return (<UploadThingButton endpoint="imageUploader" onClientUploadComplete={onClientUploadComplete} onUploadError={onUploadError} />)
}