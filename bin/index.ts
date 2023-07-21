#!/usr/bin/env node
import yargs from 'yargs'

import Database from '../src/services/database.service'

import User from '../src/models/user'
import Message from '../src/models/message'

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
.command('delete <sessionId>', 'deletes a chat', (yargs) => {
  yargs.positional('sessionId', { type: 'string', describe: 'the session ID for the chat' })
}, async function (argv) {
  const { sessionId } = argv
  await Database.connect()
  const ok = await Message.deleteMany({ sessionId })
  if (ok) console.log('Chat deleted')
  else console.log('Could not delete chat')
  await Database.close()
})
.command('delete_all', 'deletes all chats', async function (argv) {
  await Database.connect()
  const ok = await Message.deleteMany()
  if (ok) console.log('Chats deleted')
  else console.log('Could not delete chats')
  await Database.close()
})
.help()
.argv