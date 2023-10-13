'use client'

import Image from 'next/image'

import { useEffect, useState } from 'react'

import { UploadFileResponse } from 'uploadthing/client'

import { deleteImage, getImages } from '@/api'

import { MediaImage } from '@/types'

import { getImageUrl } from '@/helpers'

import UploadButton from './uploadButton'

export default function MediaGallery({ onImageSelected }: { onImageSelected: (image: MediaImage) => void }) {
  const [images, setImages] = useState<MediaImage[]>([])
  const [activeImage, setActiveImage] = useState<MediaImage | undefined>(undefined)

  useEffect(() => {
    getImages().then(setImages)
  }, [])

  function selectImage() {
    if (activeImage) onImageSelected(activeImage)
    setActiveImage(undefined)
  }

  async function deleteSelected() {
    if (!activeImage) return
    const response = await deleteImage(activeImage.key)
    if (response.success) {
      const index = images.indexOf(activeImage)
      images.splice(index, 1)
      setActiveImage(undefined)
      setImages((currentImages) => [...currentImages])
    }
  }

  function toggleActiveImage(image: MediaImage) {
    if (activeImage === image) setActiveImage(undefined)
    else setActiveImage(image)
  }

  function uploadCompleteHandler(response: UploadFileResponse[] | undefined) {
    if (!response) return
    for (const file of response) {
      const image = { key: file.key, id: file.key }
      setImages((currentImages) => [...currentImages, image])
    }
  }

  function uploadErrorHandler(error: Error) {
    console.error(error)
  }
  
  return (
    <div className="media-gallery">
      <div className="media-gallery__images">
        {images.map((image, index) => (
          <button key={index} type="button" className={`media-gallery__image ${activeImage === image ? 'media-gallery__image--active' : ''}`} onClick={() => toggleActiveImage(image)}>
            <Image src={getImageUrl(image)} width={200} height={200} alt="" />
          </button>
        ))}
      </div>
      <div className="media-gallery__upload">
        <UploadButton onClientUploadComplete={uploadCompleteHandler} onUploadError={uploadErrorHandler} />
      </div>
      <div className="modal__footer">
        <button type="button" className="modal__footer__btn modal__footer__btn--danger" disabled={!activeImage} onClick={() => deleteSelected()}>
          Delete
        </button>
        <button type="button" className="modal__footer__btn" disabled={!activeImage} onClick={() => selectImage()}>
          Select
        </button>
      </div>
    </div>
  )
}