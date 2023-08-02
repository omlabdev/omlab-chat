document.addEventListener('DOMContentLoaded', async () => {
  const inputElement = document.querySelector('[js-input]')
  const form = document.querySelector('[js-form]')
  const chatId = form?.getAttribute('data-chat-id')
  if (!chatId) return
  await getAllMessages(chatId)
  inputElement?.addEventListener('keydown', (event) => {
    if (event.code !== 'Enter') return
    event.preventDefault()
    sendMessage(chatId)
  })
  form?.addEventListener('submit', async (event) => {
    event.preventDefault()
    sendMessage(chatId)
  })
})