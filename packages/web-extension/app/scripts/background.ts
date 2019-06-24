chrome.runtime.onInstalled.addListener(function() {
  const state: any = {}

  chrome.runtime.onConnect.addListener((port) => {
    chrome.tabs.query({ active: true }, (tabs) => {
      const tab = tabs[0]
      switch (port.name) {
        case 'from_popup':
          handleConnectFromPopup(port, tab)
          break
        case 'from_contentScript':
          break
        default:
          break
      }
    })
  })

  function handleConnectFromPopup(
    port: chrome.runtime.Port,
    tab: chrome.tabs.Tab,
  ) {
    const { id: tabId } = tab
    if (!tabId) return
    const tabState = state[tabId] || {}
    state[tabId] = tabState

    port.onMessage.addListener((msg) => {
      switch (msg) {
        case 'start':
          if (!tabState.script) {
            tabState.script = true
            chrome.tabs.executeScript(tabId, {
              file: 'scripts/contentScript.js',
            })
            chrome.tabs.insertCSS(tabId, {
              file: 'styles/contentScript.css',
            })
          }
          break

        default:
          break
      }
    })
  }
})
