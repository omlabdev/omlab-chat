import { createUploadthing, type FileRouter } from 'uploadthing/next'
 
const f = createUploadthing()
 
const auth = (req: Request) => ({ id: 'fakeId' }) // Fake auth function
 
export const fileRouter = {
  imageUploader: f({ image: { maxFileSize: '4MB' } }).middleware(async ({ req }) => {
      const user = await auth(req)
      if (!user) throw new Error('Unauthorized')
      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload complete for userId:', metadata.userId)
      console.log('file url', file.url)
    }),
} satisfies FileRouter