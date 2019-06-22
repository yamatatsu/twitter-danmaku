const { onInstalled } = chrome.runtime

onInstalled.addListener(function() {
  chrome.storage.sync.set({ color: '#3aa757' }, function() {
    console.log('The color is green.')
  })
})

chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name == 'twitter_danmaku')
  port.postMessage({ question: 'hey' })
})
