function omlabInitChat(omlabChatId) {
  if (!omlabChatId) return
  const styles = document.createElement('style')
  styles.innerText = '@media (max-width: 399px){.omlab-chat-iframe{height:100vh;width:100vw;}}'
  const iframe = document.createElement('iframe')
  iframe.src = `/widget?chatId=${omlabChatId}`
  // iframe.src = `https://chat.omlabdev.com/widget?chatId=${omlabChatId}`
  iframe.classList.add('omlab-chat-iframe')
  iframe.setAttribute('frameborder', '0')
  iframe.width = 72
  iframe.height = 72
  iframe.style.bottom = '0'
  iframe.style.position = 'fixed'
  iframe.style.right = '0'
  iframe.style.maxHeight = '100vh'
  iframe.style.maxWidth = '100vw'
  iframe.style.zIndex = '99'
  // iframe.addEventListener('load', () => {
  //   if (!iframe.contentDocument?.querySelector('[js-widget]')) iframe.style.display = 'none'
  // })
  document.body.appendChild(styles)
  document.body.appendChild(iframe)
  window.addEventListener('message', (message) => {
    const { data } = message
    if (data === 'omlab-chat/open') {
      iframe.height = 580
      iframe.width = 400
      // Inform the iframe's script that the iframe has been resized
      iframe.contentWindow.postMessage('omlab-chat/open', '*')
    } else if (data === 'omlab-chat/close') {
      iframe.height = 72
      iframe.width = 72
      // Inform the iframe's script that the iframe has been resized
      iframe.contentWindow.postMessage('omlab-chat/close', '*')
    }
  })
}

const omlabChatId = document.currentScript?.dataset.chatId
if (document.readyState === 'complete') omlabInitChat(omlabChatId)
else document.addEventListener('readystatechange', () => {
  if (document.readyState === 'complete') omlabInitChat(omlabChatId)
})