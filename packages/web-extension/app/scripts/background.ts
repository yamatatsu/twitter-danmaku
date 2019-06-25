{
  chrome.runtime.onMessage.addListener((request) => {
    if (request.type === 'start') {
      console.info('start')
      start()
    }
    if (request.type === 'stop') {
      console.info('stop')
      stop()
    }
    if (request.type === 'test') {
      console.info('test')
      sendMessageToTab({
        type: 'commentFound',
        id: Date.now().toString(),
        text: 'heyheyheyhey',
      })
    }
  })

  let webSocket: WebSocket | undefined
  function start() {
    stop()
    chrome.storage.sync.get('port', (data) => {
      webSocket = new WebSocket(`ws://localhost:${data.port || 8080}`)

      webSocket.onopen = () =>
        console.info('[twitter danmaku] Websocket connection open')

      webSocket.onclose = () =>
        console.info('[twitter danmaku] Websocket connection close')

      webSocket.onerror = (err) =>
        console.error('[twitter danmaku] WebSocket error observed', err)

      webSocket.onmessage = (event) => {
        console.info('[twitter danmaku] get tweet. ', event.data)
        const data = JSON.parse(event.data)
        const id: string = data.id
        const text: string = data.text
        chrome.runtime.sendMessage({ type: 'commentFound', id, text })
        sendMessageToTab({ type: 'commentFound', id, text })
      }
    })
  }
  function stop() {
    if (!webSocket) return
    webSocket.close()
  }

  // TODO: remove any
  function sendMessageToTab(message: any) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0] || !tabs[0].id) return
      chrome.tabs.sendMessage(tabs[0].id, message)
    })
  }
}
