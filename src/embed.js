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

async function omlabCreateIframe(chatId) {
  const iframe = document.createElement('iframe')
  iframe.src = `[SITE_URL]/widget?chatId=${chatId}`
  iframe.classList.add('omlab-chat-iframe')
  iframe.setAttribute('frameborder', '0')
  iframe.width = 72
  iframe.height = 72
  iframe.style.bottom = '0'
  iframe.style.position = 'fixed'
  iframe.style.right = '0'
  iframe.style.maxHeight = '100%'
  iframe.style.maxWidth = '100vw'
  iframe.style.zIndex = '9999'
  // iframe.addEventListener('load', () => {
    // if (!iframe.contentDocument?.querySelector('[js-widget]')) iframe.style.display = 'none'
  // })
  document.body.appendChild(iframe)
  return iframe
}

function omlabHandleIframeMessage(event, iframe) {
  const { namespace, key } = event.data
  if (namespace !== 'omlab-chat') return
  if (key === 'open') {
    iframe.height = 800
    iframe.width = 500
    // Inform the iframe's script that the iframe has been resized
    omlabPostMessage(iframe.contentWindow, 'open')
  } else if (key === 'close') {
    iframe.height = 72
    iframe.width = 72
    // Inform the iframe's script that the iframe has been resized
    omlabPostMessage(iframe.contentWindow, 'close')
  } else if (key === 'ready') {
    // When the iframe indicate it's ready pass it a sessionId
    omlabGetSessionId().then((sessionId) => {
      omlabPostMessage(iframe.contentWindow, 'sessionId', sessionId)
    })
  }
}

function omlabCreateStyles() {
  const styles = document.createElement('style')
  styles.innerText = '@media (max-width: 399px){.omlab-chat-iframe{height:100vh;width:100vw;}}'
  document.body.appendChild(styles)
}

async function omlabInitChat(chatId) {
  if (!chatId) return
  omlabCreateStyles()
  const iframe = await omlabCreateIframe(chatId)
  window.addEventListener('message', (event) => omlabHandleIframeMessage(event, iframe))
}

const omlabChatId = document.currentScript?.dataset.chatId
if (document.readyState === 'complete') omlabInitChat(omlabChatId)
else document.addEventListener('readystatechange', () => {
  if (document.readyState === 'complete') omlabInitChat(omlabChatId)
})