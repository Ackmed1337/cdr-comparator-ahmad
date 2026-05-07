import { CONSOLE_OUT, CONSOLE_CLEAN } from './actions'

export default function conout(state = {actions: []}, action) {
  switch (action.type) {
    case CONSOLE_OUT:
      const { payload } = action
      if (typeof payload.obj === 'undefined') {
        console[payload.lvl](payload.txt)
      } else {
        console[payload.lvl](payload.txt, payload.obj)
      }
      return { actions: [...state.actions, action] }
    case CONSOLE_CLEAN:
      return { actions: [] }
    default:
      return state
  }
}
