const { onInstalled } = chrome.runtime

onInstalled.addListener(() => {
  chrome.storage.sync.set({ color: '#3aa757' }, () => {
    console.log('The color is green.')
  })
})

chrome.runtime.onConnect.addListener((port) => {
  console.assert(port.name == 'twitter_danmaku')
  port.postMessage({ question: 'hey' })
})
