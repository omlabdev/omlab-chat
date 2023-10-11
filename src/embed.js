// Get a sessionId either from localstorage or the API
async function omlabGetSessionId() {
  let sessionId = localStorage.getItem('omlabSessionId')
  if (!sessionId) {
    const response = (await fetch('[SITE_URL]/api/session', { cache: 'no-cache' }))
    sessionId = (await response.json()).sessionId
    localStorage.setItem('omlabSessionId', sessionId)
  }
  return sessionId
}

function omlabPostMessage(element, key, value) {
  if (!element) return
  const message = { namespace: 'omlab-chat', key, value }
  element.postMessage(message, '*')
}

function omlabCreateIframe(chatId, widgetStyle) {
  const iframe = document.createElement('iframe')
  iframe.src = `[SITE_URL]/widget?chatId=${chatId}&style=${widgetStyle}`
  iframe.classList.add('omlab-chat-iframe')
  iframe.setAttribute('frameborder', '0')
  if (widgetStyle === 'floating') {
    iframe.width = 80
    iframe.height = 80
    iframe.style.bottom = '0'
    iframe.style.position = 'fixed'
    iframe.style.right = '0'
    iframe.style.maxHeight = '100%'
    iframe.style.maxWidth = '100vw'
    iframe.style.zIndex = '9999'
  } else if (widgetStyle === 'inline') {
    iframe.style.height = '100%'
    iframe.style.maxHeight = '100%'
    iframe.style.maxWidth = '100%'
    iframe.style.width = '100%'
  }
  // iframe.addEventListener('load', () => {
    // if (!iframe.contentDocument?.querySelector('[js-widget]')) iframe.style.display = 'none'
  // })
  if (widgetStyle === 'floating') {
    document.body.appendChild(iframe)
  } else if (widgetStyle === 'inline') {
    const chatContainer = document.querySelector('#omlab-chat-container')
    if (!chatContainer) throw 'No chat container found. Please add an element with id="omlab-chat-container"'
    chatContainer.innerHTML = ''
    chatContainer.appendChild(iframe)
  }
  window.OmLabChat.iframe = iframe
}

function omlabOpenChat() {
  document.body.classList.add('omlab-chat-open')
  window.OmLabChat.iframe.height = 815
  window.OmLabChat.iframe.width = 500
  window.OmLabChat.iframe.classList.add('open')
  // Inform the iframe's script that the iframe has been resized
  omlabPostMessage(window.OmLabChat.iframe.contentWindow, 'open')
}

function omlabCloseChat() {
  document.body.classList.remove('omlab-chat-open')
  window.OmLabChat.iframe.height = 80
  window.OmLabChat.iframe.width = 80
  window.OmLabChat.iframe.classList.remove('open')
  // Inform the iframe's script that the iframe has been resized
  omlabPostMessage(window.OmLabChat.iframe.contentWindow, 'close')
}

function omlabHandleIframeMessage(event) {
  const { namespace, key } = event.data
  if (namespace !== 'omlab-chat') return
  if (key === 'open') omlabOpenChat()
  else if (key === 'close') omlabCloseChat()
  else if (key === 'ready') {
    window.OmLabChat.status = 'ready'
    omlabPostMessage(window, 'loaded')
    // When the iframe indicate it's ready pass it a sessionId
    omlabGetSessionId().then((sessionId) => {
      omlabPostMessage(window.OmLabChat.iframe.contentWindow, 'sessionId', sessionId)
    })
  }
}

function omlabCreateStyles(widgetStyle) {
  const styles = document.createElement('style')
  if (widgetStyle === 'floating') {
    styles.innerText = '@media (max-width: 399px){.omlab-chat-open{overflow:hidden};.omlab-chat-iframe.open{height:100%;width:100vw;}}'
  } else if (widgetStyle === 'inline') {
    styles.innerText = '#omlab-chat-container{height:750px;max-height:100%;width:100%;}'
  }
  document.body.appendChild(styles)
}

async function omlabInitChat(chatId, widgetStyle = 'floating') {
  if (!chatId) return
  omlabCreateStyles(widgetStyle)
  omlabCreateIframe(chatId, widgetStyle)
  window.addEventListener('message', (event) => omlabHandleIframeMessage(event))
}

window.OmLabChat = {
  status: 'loading',
  iframe: undefined,
  open: omlabOpenChat,
  close: omlabCloseChat,
}

const omlabChatId = document.currentScript?.dataset.chatId
const widgetStyle = document.currentScript?.dataset.widgetStyle
if (document.readyState === 'complete') omlabInitChat(omlabChatId, widgetStyle)
else document.addEventListener('readystatechange', () => {
  if (document.readyState === 'complete') omlabInitChat(omlabChatId, widgetStyle)
})