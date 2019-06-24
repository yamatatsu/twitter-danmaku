const portInput = document.getElementById('port')
const fontColorInput = document.getElementById('fontColor')
const fontSizeInput = document.getElementById('fontSize')
const startButton = document.getElementById('start')
const stopButton = document.getElementById('stop')
const testButton = document.getElementById('test')

syncToStorage(portInput, 'port')
syncToStorage(fontColorInput, 'fontColor')
syncToStorage(fontSizeInput, 'fontSize')

startButton.onclick = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.executeScript(tabs[0].id, {
      file: 'scripts/contentScript.js',
    })
    chrome.tabs.insertCSS(tabs[0].id, {
      file: 'styles/contentScript.css',
    })
  })
}

chrome.runtime.onConnect.addListener((port) => {
  console.assert(port.name == 'twitter_danmaku')

  testButton.onclick = () => {
    port.postMessage('heyheyheyheyhey')
  }
})

function syncToStorage(input, key) {
  chrome.storage.sync.get(key, (data) => {
    if (data[key]) input.value = data[key]
  })

  input.onChange = (el) => {
    chrome.storage.sync.set({ [key]: el.target.value })
  }
}
