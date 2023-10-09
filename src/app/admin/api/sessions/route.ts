import { NextResponse } from 'next/server'

import Database from '@/services/database.service'

import message from '@/models/message'

export async function DELETE() {
  await Database.connect()
  const result = await message.deleteMany({ sessionId: { $ne: null } }).exec()
  return NextResponse.json({ success: result?.acknowledged })
}