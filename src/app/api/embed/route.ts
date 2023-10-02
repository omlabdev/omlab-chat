import { readFileSync } from 'fs'
import path from 'path'

const { NEXT_PUBLIC_SITE_URL } = process.env

export function GET() {
  const file = readFileSync(path.resolve('.', 'src/embed.js')).toString()
  const body = file.replaceAll('[SITE_URL]', NEXT_PUBLIC_SITE_URL || '')
  return new Response(body, { headers: { 'Content-Type': 'text/javascript' } })
}