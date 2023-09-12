# Om Lab GPT

## Endpoints

### /api/chats/[chatId]

- GET: Get a chat (just the chat, not its messages)

### /api/chats/[chatId]/messages

All these endpoints require a `SessionId` cookie to be set on the request.

- GET: Get all the messages of a given chat and Session
- POST: Post a new message to a given chat and Session
- DELETE: Delete all messages for a given chat and Session

## Admin endpoints

### /admin/api/chats/messages

- GET: Get all the general system messages (system messages that do not belong to a specific chat)
- POST: Post a new general system message (a system message that does not belong to a specific chat)

### /admin/api/chats/messages/[messageId]

- DELETE: Delete a general system message (a system message that does not belong to a specific chat)

### /admin/api/chats/[chatId]/messages

- GET: Get all the system messages for a given chat
- POST: Post a new system message to a given chat