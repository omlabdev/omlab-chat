function closeWidget(widgetChatWrapper, widgetToggleBtn) {
  widgetChatWrapper?.classList.remove('show')
  widgetChatWrapper?.setAttribute('aria-hidden', 'true')
  widgetToggleBtn?.setAttribute('aria-expanded', 'false')
}

function openWidget(widgetChatWrapper, widgetToggleBtn) {
  widgetChatWrapper?.classList.add('show')
  widgetChatWrapper?.setAttribute('aria-hidden', 'false')
  widgetToggleBtn?.setAttribute('aria-expanded', 'true')
}

function toggleWidget(widgetChatWrapper, widgetToggleBtn) {
  if (widgetChatWrapper?.classList.contains('show')) closeWidget(widgetChatWrapper, widgetToggleBtn)
  else openWidget(widgetChatWrapper, widgetToggleBtn)
}

window.addEventListener('DOMContentLoaded', () => {
  const widgetChatWrapper = document.querySelector('[js-widget-chat-wrapper]')
  const widgetToggleBtn = document.querySelector('[js-widget-toggle]')
  widgetToggleBtn?.addEventListener('click', () => toggleWidget(widgetChatWrapper, widgetToggleBtn))
  const widgetCloseBtn = document.querySelector('[js-widget-close]')
  widgetCloseBtn?.addEventListener('click', () => closeWidget(widgetChatWrapper, widgetToggleBtn))
})