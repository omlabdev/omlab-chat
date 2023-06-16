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

function loadWidget() {
  const widget = document.createElement('div')
  widget.classList.add('widget')
  const chatWrapper = document.createElement('div')
  chatWrapper.classList.add('widget__chat-wrapper')
  widget.setAttribute('js-widget-chat-wrapper', '')
  const iframe = document.createElement('iframe')
  iframe.classList.add('widget__iframe')
  iframe.src = 'https://chat.omlabdev.com/widget'
  iframe.setAttribute('frameborder', '0')
  iframe.setAttribute('width', '370')
  iframe.setAttribute('height', '766')
  const toggleBtn = document.createElement('button')
  toggleBtn.classList.add('widget__toggle-btn')
  toggleBtn.setAttribute('js-widget-toggle', '')
  const toggleImg = document.createElement('img')
  toggleImg.classList.add('widget__toggle-btn__img')
  toggleImg.src = 'https://chat.omlabdev.com/imgs/om-lab-logo.png'
  toggleImg.setAttribute('alt', 'Close chat')
  toggleBtn.appendChild(toggleImg)
  toggleBtn.addEventListener('click', () => toggleWidget(chatWrapper, toggleBtn))
  const closeBtn = document.createElement('button')
  closeBtn.classList.add('widget__close-btn')
  closeBtn.setAttribute('js-widget-close', '')
  closeBtn.setAttribute('type', 'button')
  closeBtn.addEventListener('click', () => closeWidget(chatWrapper, toggleBtn))
  chatWrapper.appendChild(closeBtn)
  chatWrapper.appendChild(iframe)
  widget.appendChild(chatWrapper)
  widget.appendChild(toggleBtn)
  document.body.appendChild(widget)
}

window.addEventListener('DOMContentLoaded', () => loadWidget())