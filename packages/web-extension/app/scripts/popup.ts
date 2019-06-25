window.addEventListener('load', () => {
  const portInput = document.getElementById('port') as HTMLInputElement
  const fontColorInput = document.getElementById(
    'fontColor',
  ) as HTMLInputElement
  const fontSizeInput = document.getElementById('fontSize') as HTMLInputElement
  const startButton = document.getElementById('start') as HTMLButtonElement
  const stopButton = document.getElementById('stop') as HTMLButtonElement
  const testButton = document.getElementById('test') as HTMLButtonElement

  syncToStorage(portInput, 'port')
  syncToStorage(fontColorInput, 'fontColor')
  syncToStorage(fontSizeInput, 'fontSize')

  startButton.onclick = () => {
    chrome.runtime.sendMessage({ type: 'start' })
  }

  stopButton.onclick = () => {
    chrome.runtime.sendMessage({ type: 'stop' })
  }

  testButton.onclick = () => {
    chrome.runtime.sendMessage({ type: 'test' })
  }

  function syncToStorage(input: HTMLInputElement | null, key: string) {
    if (!input) return
    chrome.storage.sync.get(key, (data) => {
      if (data[key]) input.value = data[key]
    })

    input.addEventListener('blur', (el) => {
      if (!el.target) return
      const target = el.target as Attr
      el.target && chrome.storage.sync.set({ [key]: target.value })
    })
  }
})
