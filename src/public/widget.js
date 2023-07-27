function closeWidget(widgetChatWrapper, widgetToggleBtn) {
  // Communicate to the parent window that the chat is going to be closed
  window.top.postMessage('omlab-chat/close')
  // This setTimeout is here so this code runs after the parent window has resized the iframe
  setTimeout(() => {
    widgetChatWrapper?.classList.remove('show')
    widgetChatWrapper?.setAttribute('aria-hidden', 'true')
    widgetToggleBtn?.setAttribute('aria-expanded', 'false')
  }, 0)
}

function openWidget(widgetChatWrapper, widgetToggleBtn) {
  // Communicate to the parent window that the chat is going to be opened
  window.top.postMessage('omlab-chat/open')
  // This setTimeout is here so this code runs after the parent window has resized the iframe
  setTimeout(() => {
    widgetChatWrapper?.classList.add('show')
    widgetChatWrapper?.setAttribute('aria-hidden', 'false')
    widgetToggleBtn?.setAttribute('aria-expanded', 'true')
  }, 0)
}

function toggleWidget(widgetChatWrapper, widgetToggleBtn) {
  if (widgetChatWrapper?.classList.contains('show')) closeWidget(widgetChatWrapper, widgetToggleBtn)
  else openWidget(widgetChatWrapper, widgetToggleBtn)
}

window.addEventListener('DOMContentLoaded', () => {
  const chatWrapper = document.querySelector('[js-widget-wrapper]')
  const closeBtn = document.querySelector('[js-widget-close]')
  closeBtn.addEventListener('click', () => closeWidget(chatWrapper, toggleBtn))
  const toggleBtn = document.querySelector('[js-widget-toggle]')
  toggleBtn.addEventListener('click', () => toggleWidget(chatWrapper, toggleBtn))
})