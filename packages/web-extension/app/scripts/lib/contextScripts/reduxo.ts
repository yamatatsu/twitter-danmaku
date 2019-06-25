export type Styles = { fontColor: string; fontSize: number }
export type CommentType = {
  thread: number
  id: string
  text: string
}
type State = { styles: Styles; nextThread: number; comments: CommentType[] }
export type Action =
  | { type: 'commentAdded'; comment: CommentType }
  | { type: 'commentGotOut'; id: string }
  | { type: 'interval' }
  | { type: 'commentFound'; id: string; text: string }
  | { type: 'setStyle'; styles: Partial<Styles> }

let state: State = {
  styles: {
    fontColor: '#333',
    fontSize: 36,
  },
  nextThread: 1,
  comments: [],
}

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'commentAdded': {
      return {
        ...state,
        comments: [...state.comments, action.comment],
      }
    }
    case 'commentGotOut': {
      return {
        ...state,
        comments: state.comments.filter((c) => c.id !== action.id),
      }
    }
    case 'setStyle': {
      return { ...state, styles: { ...state.styles, ...action.styles } }
    }
  }
  return state
}

// TODO: clone
const getState = () => state

export type Middleware = (
  _getState: typeof getState,
  action: Action,
) => (next: () => void) => void

const middelewares: Middleware[] = []
export function addMiddleware(...middeware: Middleware[]) {
  middelewares.push(...middeware)
}

export function dispatch(action: Action) {
  const composed = middelewares
    .map((m) => m(getState, action))
    .reverse()
    .reduce(
      (next: () => void, prev) => {
        return () => prev(() => next())
      },
      () => {
        state = reducer(state, action)
      },
    )
  composed()
}
