import { dispatch, addMiddleware } from './lib/contextScripts/reduxo'
import { middlewares } from './lib/contextScripts/view'
{
  addMiddleware((getState, action) => (next) => {
    if (action.type === 'interval') return next()
    console.info(action)
    next()
  })
  addMiddleware(...middlewares)

  setInterval(() => dispatch({ type: 'interval' }), 1000)

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'commentFound') {
      chrome.storage.sync.get(['fontColor', 'fontSize'], (data) => {
        const fontColor: string = data.fontColor
        const fontSize: string = data.fontSize
        dispatch({ type: 'setStyle', styles: { fontColor, fontSize } })
        dispatch(request)
      })
    }
  })
  console.info('[twitter danmaku] loaded')
}
