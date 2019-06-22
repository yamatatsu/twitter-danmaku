const changeColor = document.getElementById('changeColor')
const wordInput = document.getElementById('word')
const wordBox = document.getElementById('word_box')
const testButton = document.getElementById('testButton')

chrome.storage.sync.get('color', (data) => {
  changeColor.style.backgroundColor = data.color
  changeColor.setAttribute('value', data.color)
})

chrome.storage.sync.get('word', (data) => {
  wordBox.innerHTML = data.word
})

wordInput.onblur = (el) => {
  chrome.storage.sync.set({ word: el.target.value }, () => {
    wordBox.innerHTML = el.target.value
  })
  chrome.runtime.sendMessage({ word: el.target.value }, (response) => {
    console.log(response.farewell)
  })
}

changeColor.onclick = (element) => {
  const color = element.target.value
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.executeScript(tabs[0].id, {
      file: 'scripts/contentScript.js',
    })
    chrome.tabs.insertCSS(tabs[0].id, {
      file: 'styles/contentScript.css',
    })
  })
  console.log('yahooo')
}

chrome.runtime.onConnect.addListener((port) => {
  console.assert(port.name == 'twitter_danmaku')
  testButton.onclick = () => {
    port.postMessage({ tweets: ['hey', 'yoyoyo'] })
  }
})
