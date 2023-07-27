window.addEventListener('DOMContentLoaded', () => {
  const iframe = document.createElement('iframe')
  iframe.src = '/widget'
  iframe.setAttribute('frameborder', '0')
  iframe.width = 64
  iframe.height = 64
  iframe.style.bottom = '10px'
  iframe.style.position = 'fixed'
  iframe.style.right = '10px'
  iframe.style.zIndex = '99'
  document.body.appendChild(iframe)
  window.addEventListener('message', (message) => {
    const { data } = message
    if (data === 'omlab-chat/open') {
      iframe.height = 580
      iframe.width = 320
      // Inform the ifrmae's script that the iframe has been resized
      iframe.contentWindow.postMessage('omlab-chat/open', '*')
    } else if (data === 'omlab-chat/close') {
      iframe.height = 64
      iframe.width = 64
      // Inform the ifrmae's script that the iframe has been resized
      iframe.contentWindow.postMessage('omlab-chat/close', '*')
    }
  })
}, { once: true })