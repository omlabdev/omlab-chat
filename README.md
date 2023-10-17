# Om Lab GPT

## Endpoints

### /api/embed

- GET: Returns a JS file to embed a chat widget on any external site.

### /api/session

- GET: Returns a new & unique sessionId. (CORS is enabled for this route)

### /api/chats/[chatId]

- GET: Get a chat (just the chat, not its messages)

### /api/chats/[chatId]/messages

All these endpoints require a `sessionId` query search parameter to be set on the request's URL.

- GET: Get all the messages of a given chat and Session
- POST: Post a new message to a given chat and Session

## Admin endpoints

### /admin/api/chats

- GET: Get all the chats on the system (just the chats, not its messages).

### /admin/api/chats/messages

- GET: Get all the general system messages (system messages that do not belong to a specific chat)
- POST: Post a new general system message (a system message that does not belong to a specific chat)

### /admin/api/chats/messages/[messageId]

- DELETE: Delete a general system message (a system message that does not belong to a specific chat)

### /admin/api/chats/[chatId]

- POST: Update an existing chat information (Name, colors, etc.)
- DELETE: Delete all the messages of the given chat and sesison (Requires a `sessionId` query search parameter to be set on the request's URL.)

### /admin/api/chats/[chatId]/messages

- GET: Get all the system messages for a given chat
- POST: Post a new system message to a given chat

## Useful prompts

-  Don’t justify your answers. Don’t give me information not mentioned in the CONTEXT INFORMATION about products and services.