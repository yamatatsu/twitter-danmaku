import { dispatch, addMiddleware } from './lib/contextScripts/reduxo'
import { middlewares } from './lib/contextScripts/view'

addMiddleware((getState, action) => (next) => {
  if (action.type === 'interval') return next()
  console.info(action)
  next()
})
addMiddleware(...middlewares)

chrome.storage.sync.get(['fontColor', 'fontSize'], (data) => {
  const fontColor: string = data.fontColor
  const fontSize: string = data.fontSize
  dispatch({ type: 'setStyle', styles: { fontColor, fontSize } })
})

chrome.storage.sync.get('port', (data) => {
  const webSocket = new WebSocket(`ws://localhost:${data.port || 8080}`)

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
    dispatch({ type: 'commentFound', id, text })
  }
})

setInterval(() => dispatch({ type: 'interval' }), 1000)

const port = chrome.runtime.connect({ name: 'twitter_danmaku' })
port.onMessage.addListener((text: string) =>
  dispatch({ type: 'commentFound', id: Date.now().toString(), text }),
)
