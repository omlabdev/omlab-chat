function setLoader(status) {
  const loader = document.querySelector('[js-loader]')
  if (!loader) return
  if (status) loader.classList.add('show')
  else loader.classList.remove('show')
}

function createMessage(message) {
  const messageElement = document.createElement('li')
  messageElement.classList.add('message')
  messageElement.classList.add(`message--${message.role}`)
  messageElement.innerText = message.content
  return messageElement
}

function addMessage(message) {
  const messagesList = document.querySelector('[js-messages]')
  const messagesWrapper = document.querySelector('[js-messages-wrapper]')
  if (!messagesList) return
  const messageElement = createMessage(message)
  messagesList.appendChild(messageElement)
  if (messagesWrapper) messagesWrapper.scrollTop = messagesWrapper.scrollHeight
}

async function sendMessage() {
  const inputElement = document.querySelector('[js-input]')
  const messages = document.querySelector('[js-messages]')
  if ((!inputElement) || (!messages)) return
  setLoader(true)
  const input = inputElement.value
  inputElement.value = ''
  addMessage({ role: 'user', content: input })
  const body = JSON.stringify({ message: input })
  const response = await fetch('/', { method: 'post', headers: { 'content-type': 'application/json' }, body })
  const message = await response.json()
  addMessage(message)
  setLoader(false)
}

document.addEventListener('DOMContentLoaded', () => {
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