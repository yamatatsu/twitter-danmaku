const viewer = document.createElement('div')
viewer.className = 'twitter_danmaku_viewer'
document.body.appendChild(viewer)

// const port = chrome.runtime.connect({ name: 'twitter_danmaku' })

const comments = []

// port.onMessage.addListener(flowComment)

chrome.storage.sync.get('port', (data) => {
  const webSocket = new WebSocket(`ws://localhost:${data.port || 8080}`)
  webSocket.onopen = () => log('Websocket connection open')
  webSocket.onclose = () => log('Websocket connection close')
  webSocket.onerror = (err) => logError('WebSocket error observed.', event)
  webSocket.onmessage = (event) => {
    log('get tweet. ', event.data)
    flowComment(event.data)
  }
})

setInterval(() => {
  comments.filter(hasGotOut).forEach((c) => viewer.removeChild(c))
}, 1000)

////////////////
// lib

function log(txt, ...obj) {
  console.info(`[twitter danmaku] ${txt}`, ...obj)
}
function logError(txt, ...obj) {
  console.error(`[twitter danmaku] ${txt}`, ...obj)
}

function flowComment(comment) {
  const ele = document.createElement('div')
  ele.innerText = comment
  ele.className = 'twitter_danmaku_comment'
  ele.style.top = `${comments.length * 36}px`

  viewer.appendChild(ele)
  comments.push(ele)
}

function hasGotOut(el) {
  const rect = el.getBoundingClientRect()
  return rect.right < 0
}
