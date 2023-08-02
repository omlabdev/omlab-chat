#!/usr/bin/env node
import yargs from 'yargs'
import dotenv from 'dotenv'

import Database from '../src/services/database.service'

import { generateChatId } from '../src/helpers'

import User from '../src/models/user'
import Message from '../src/models/message'
import chat from '../src/models/chat'

// Enviorment variables
dotenv.config()
const { MAX_INACTIVE_TIME } = process.env

yargs.scriptName('user')
.usage('$0 <cmd> [args]')
.command('create <email> <password>', 'create a new user', (yargs) => {
  yargs.positional('email', { type: 'string', describe: 'the email for the user' })
  yargs.positional('password', { type: 'string', describe: 'the password for the user' })
}, async function (argv) {
  const { email, password } = argv
  console.log(`Creating user ${email}`)
  await Database.connect()
  const user = await User.create({ email, password })
  await user.save()
  await Database.close()
  console.log('User created')
})
.command('list', 'list all users', async function (argv) {
  await Database.connect()
  const users = await User.find()
  console.log(users)
  await Database.close()
})
.command('delete <email>', 'deletes a user', (yargs) => {
  yargs.positional('email', { type: 'string', describe: 'the email for the user' })
}, async function (argv) {
  const { email } = argv
  await Database.connect()
  const ok = await User.deleteOne({ email })
  if (ok) console.log('User deleted')
  else console.log('Could not delete user')
  await Database.close()
})
.help()
.argv

yargs.scriptName('chat')
.usage('$0 <cmd> [args]')
.command('delete <sessionId>', 'deletes a user chat', (yargs) => {
  yargs.positional('sessionId', { type: 'string', describe: 'the session ID for the chat' })
}, async function (argv) {
  const { sessionId } = argv
  await Database.connect()
  const ok = await Message.deleteMany({ sessionId })
  if (ok) console.log('Chat deleted')
  else console.log('Could not delete chat')
  await Database.close()
})
.command('delete_all', 'deletes all user chats', async function (argv) {
  await Database.connect()
  const ok = await Message.deleteMany({ sessionId: { $ne: undefined } })
  if (ok) console.log('Chats deleted')
  else console.log('Could not delete all chats')
  await Database.close()
})
.command('clean', 'deletes all inactive chats', async function (argv) {
  await Database.connect()
  const maxInactiveTime = Number(MAX_INACTIVE_TIME) || 7 * 24 * 60 * 60 * 1000
  const limitDate = new Date(Date.now() - maxInactiveTime)
  // Get the session ID's from messages older than the limit date
  const oldSessionIds = await Message.find({ createdAt: { $lte: limitDate } }).select('sessionId').distinct('sessionId')
  // Get the session ID's from messages newer than the limit date
  const NewSessionIds = await Message.find({ createdAt: { $gt: limitDate } }).select('sessionId').distinct('sessionId')
  // Get all the session ID's that do not have messages newer than the limit date
  const toDeleteSessionIds = oldSessionIds.filter((sessionId) => !NewSessionIds.includes(sessionId))
  // Delete all messages from sessions that have been inactive after the limit date
  const ok = await Message.deleteMany({ sessionId: { $in: toDeleteSessionIds } })
  if (ok) console.log('Old chats deleted')
  else console.log('Could not delete old chats')
  await Database.close()
})
.command('new <name>', 'creates a new chat ID', (yargs) => {
  yargs.positional('name', { type: 'string', describe: 'the name for the new chat' })
}, async function (argv) {
  const { name } = argv
  await Database.connect()
  const chatId = generateChatId()
  const ok = await chat.create({ name, chatId })
  if (ok) console.log('New chat ID created', chatId)
  else console.log('Could not create the new chat')
  await Database.close()
})
.help()
.argv