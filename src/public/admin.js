async function sendAdminMessage() {
  const chatId = document.querySelector('[js-admin-chat-id]')?.value
  const inputElement = document.querySelector('[js-admin-input]')
  const role = document.querySelector('[js-admin-radio]:checked')?.value
  const messages = document.querySelector('[js-messages]')
  if ((!inputElement) || (!messages)) return
  setLoader(true)
  const input = inputElement.value
  inputElement.value = ''
  const body = JSON.stringify({ message: input, role, chatId })
  let message
  try {
    const response = await fetch('/admin', { method: 'post', headers: { 'content-type': 'application/json' }, body })
    message = await response.json()
  } catch (error) {
    message = { role: 'error', content: 'There was an error processing your message, please try again' }
    console.error(error)
  }
  const messageElement = addMessage(message)
  messageElement.setAttribute('js-message', message._id)
  const deleteBtn = document.createElement('button')
  deleteBtn.classList.add('delete-btn')
  deleteBtn.type = 'button'
  deleteBtn.setAttribute('js-delete', message._id)
  deleteBtn.innerText = 'X'
  deleteBtn.addEventListener('click', () => deleteMessage(message._id))
  messageElement.appendChild(deleteBtn)
  setLoader(false)
}

async function deleteMessage(messageId) {
  const message = document.querySelector(`[js-message="${messageId}"]`)
  if (!message) return
  setLoader(true)
  const body = JSON.stringify({ messageId })
  try {
    const response = await fetch('/admin', { method: 'delete', headers: { 'content-type': 'application/json' }, body })
    if ((await response.json()).success) message.remove()
  } catch (error) {
    addMessage({ role: 'error', content: 'There was an error processing your message, please try again' })
    console.error(error)
  }
  setLoader(false)
}

function selectChat(chatId) {
  window.location = `/admin/${chatId}`
}

document.addEventListener('DOMContentLoaded', () => {
  const inputElement = document.querySelector('[js-admin-input]')
  const form = document.querySelector('[js-admin-form]')
  inputElement?.addEventListener('keydown', (event) => {
    if (event.code !== 'Enter') return
    event.preventDefault()
    sendAdminMessage()
  })
  form?.addEventListener('submit', async (event) => {
    event.preventDefault()
    sendAdminMessage()
  })
  document.querySelectorAll('[js-delete]').forEach((deleteBtn) => {
    const messageId = deleteBtn.getAttribute('js-delete')
    deleteBtn.addEventListener('click', () => deleteMessage(messageId))
  })
  const chatSelect = document.querySelector('[js-admin-chats-select]')
  chatSelect?.addEventListener('change', () => selectChat(chatSelect.value))
})