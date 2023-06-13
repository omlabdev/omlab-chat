document.addEventListener('DOMContentLoaded', async () => {
  await getAllMessages()
  const inputElement = document.querySelector('[js-input]')
  const form = document.querySelector('[js-form]')
  inputElement?.addEventListener('keydown', (event) => {
    if (event.code !== 'Enter') return
    event.preventDefault()
    sendMessage()
  })
  form?.addEventListener('submit', async (event) => {
    event.preventDefault()
    sendMessage()
  })
})