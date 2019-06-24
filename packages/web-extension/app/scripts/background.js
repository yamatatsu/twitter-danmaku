const { onInstalled } = chrome.runtime

onInstalled.addListener(() => {
  chrome.storage.sync.set({ color: '#3aa757' }, () => {
    console.log('The color is green.')
  })
})

chrome.runtime.onConnect.addListener((port) => {
  console.assert(port.name == 'twitter_danmaku')

  chrome.storage.sync.get('port', (data) => {
    const webSocket = new WebSocket(`ws://localhost:${data.port || 8080}`)
    webSocket.onopen = (event) => {
      console.log('Websocket connection open')
    }
    webSocket.onmessage = (event) => {
      console.log(event)
      port.postMessage(event.data)
    }
  })
})
