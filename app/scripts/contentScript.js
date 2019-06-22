const viewer = document.createElement('div')
viewer.className = 'twitter_danmaku_viewer'
document.body.appendChild(viewer)

const port = chrome.runtime.connect({ name: 'twitter_danmaku' })

const comments = []

port.onMessage.addListener((msg) => {
  const commentEl = createEl('<h1>heyhey</h1>')
  viewer.appendChild(commentEl)
  comments.push(commentEl)
})

setInterval(() => {
  comments.filter(hasGotOut).forEach((c) => viewer.removeChild(c))
}, 1000)

////////////////
// lib

function createEl(comment) {
  const commentEl = document.createElement('div')
  commentEl.innerText = comment
  commentEl.className = 'twitter_danmaku_comment'
  return commentEl
}

function hasGotOut(el) {
  const rect = el.getBoundingClientRect()
  return rect.right < 0
}
