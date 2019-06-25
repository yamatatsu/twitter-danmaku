import { dispatch, Middleware, CommentType, Styles } from './reduxo'

export const middlewares: Middleware[] = [
  (getState, action) => (next) => {
    next()
    if (action.type !== 'commentAdded') return

    const { styles, comments } = getState()
    flowComment(action.comment, styles)
    comments.forEach(({ id }) => {
      const ele = document.getElementById(id)
      if (ele && hasGotOut(ele)) {
        dispatch({ type: 'commentGotOut', id })
        document.body.removeChild(ele)
      }
    })
  },
  (getState, action) => (next) => {
    next()
    if (action.type !== 'commentFound') return
    const { id, text } = action
    const vacantThread = findVacantThread(getState().comments)
    dispatch({
      type: 'commentAdded',
      comment: { thread: vacantThread, id, text },
    })
  },
]

function flowComment(comment: CommentType, style: Styles) {
  const { fontColor, fontSize } = style

  const ele = document.createElement('div')
  ele.id = comment.id
  ele.innerText = comment.text
  ele.className = 'twitter_danmaku_comment'
  ele.style.color = fontColor || '#333'
  ele.style.fontSize = fontSize || '36px'
  ele.style.top = `${(comment.thread - 1) * 36}px`

  document.body.appendChild(ele)
}

function findVacantThread(comments: CommentType[]) {
  // thread は10本にしてみる
  for (let i = 1; i < 10; i++) {
    const threadComennts = comments.filter((c) => c.thread === i)
    if (threadComennts.length === 0) return i

    const vacant = threadComennts
      .map((c) => document.getElementById(c.id))
      .every((ele) => ele && hasDisplayedWhole(ele))

    if (vacant) {
      return i
    }
  }
  return 1 // TODO: どうする
}

function hasGotOut(el: Element) {
  const rect = el.getBoundingClientRect()
  return rect.right < 0
}

function hasDisplayedWhole(el: Element) {
  const rect = el.getBoundingClientRect()
  return rect.right < window.innerWidth
}
