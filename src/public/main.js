function enableLinks(text) {
  const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z\d+&@#/%?=~_|!:,.;]*[-A-Z\d+&@#/%=~_|])/ig
  return text.replace(urlRegex, (url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer nofollow">${url}</a>`
  })
}

async function getAllMessages() {
  setLoader(true)
  let messages
  try {
    const response = await fetch('/json', { method: 'get' })
    messages = await response.json()
  } catch (error) {
    messages = [{ role: 'error', content: 'There was an error processing your message, please try again' }]
    console.error(error)
  }
  for (const message of messages) {
    addMessage(message)
  }
  setLoader(false)
}

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
  messageElement.innerHTML = message.content.replaceAll('\n', '<br>')
  return messageElement
}

function addMessage(message) {
  message.content = enableLinks(message.content)
  const messagesList = document.querySelector('[js-messages]')
  const messagesWrapper = document.querySelector('[js-messages-wrapper]')
  if (!messagesList) return
  const messageElement = createMessage(message)
  messagesList.appendChild(messageElement)
  if (messagesWrapper) messagesWrapper.scrollTop = messagesWrapper.scrollHeight
  return messageElement
}

async function sendMessage() {
  const inputElement = document.querySelector('[js-input]')
  const messages = document.querySelector('[js-messages]')
  if ((!inputElement) || (!messages)) return
  const input = inputElement.value
  if (!input) return
  setLoader(true)
  inputElement.value = ''
  addMessage({ role: 'user', content: input })
  const body = JSON.stringify({ message: input })
  let message
  try {
    const response = await fetch('/', { method: 'post', headers: { 'content-type': 'application/json' }, body })
    message = await response.json()
  } catch (error) {
    message = { role: 'error', content: 'There was an error processing your message, please try again' }
    console.error(error)
  }
  window.dispatchEvent(new CustomEvent('omlab-chat/new-message', { message }))
  addMessage(message)
  setLoader(false)
}