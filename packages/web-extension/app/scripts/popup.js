const portInput = document.getElementById('port')
const startButton = document.getElementById('start')
const stopButton = document.getElementById('stop')

chrome.storage.sync.get('port', (data) => {
  if (data.port) portInput.value = data.port
})

portInput.onChange = (el) => {
  chrome.storage.sync.set({ port: el.target.value })
}

startButton.onclick = (element) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.executeScript(tabs[0].id, {
      file: 'scripts/contentScript.js',
    })
    chrome.tabs.insertCSS(tabs[0].id, {
      file: 'styles/contentScript.css',
    })
  })
}
