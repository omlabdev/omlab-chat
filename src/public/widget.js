// We use window.top.postMessage to tell the parent window's script to resize the iframe when toggling the chat window

function closeWidget(widgetChatWrapper, widgetToggleBtn) {
  widgetChatWrapper?.classList.remove('show')
  widgetChatWrapper?.setAttribute('aria-hidden', 'true')
  widgetToggleBtn?.setAttribute('aria-expanded', 'false')
}

function openWidget(widgetChatWrapper, widgetToggleBtn) {
  widgetChatWrapper?.classList.add('show')
  widgetChatWrapper?.setAttribute('aria-hidden', 'false')
  widgetToggleBtn?.setAttribute('aria-expanded', 'true')
  widgetToggleBtn?.classList.remove('badge')
}

function toggleWidget(widgetChatWrapper) {
  if (widgetChatWrapper?.classList.contains('show')) window.top.postMessage('omlab-chat/close', '*')
  else window.top.postMessage('omlab-chat/open', '*')
}

window.addEventListener('DOMContentLoaded', () => {
  const chatWrapper = document.querySelector('[js-widget-wrapper]')
  const closeBtn = document.querySelector('[js-widget-close]')
  closeBtn.addEventListener('click', () => window.top.postMessage('omlab-chat/close', '*'))
  const toggleBtn = document.querySelector('[js-widget-toggle]')
  toggleBtn.addEventListener('click', () => toggleWidget(chatWrapper, toggleBtn))
  window.addEventListener('message', (message) => {
    const { data } = message
    if (data === 'omlab-chat/open') {
      openWidget(chatWrapper, toggleBtn)
    } else if (data === 'omlab-chat/close') {
      closeWidget(chatWrapper, toggleBtn)
    }
  })
  window.addEventListener('omlab-chat/new-message', () => {
    if (toggleBtn?.getAttribute('aria-expanded') === 'false') toggleBtn?.classList.add('badge')
  })
}, { once: true })
