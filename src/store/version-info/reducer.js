import {
  LOAD_VERSION_INFO,
  SAVE_VERSION_INFO,
  SET_VERSIONS_EDITABLE,
  SET_VERSIONS_READ_ONLY
} from './actions'

export default function versionInfo(state={vHeaders: {xV: '999', xMinV: '1'}}, action) {
  const vHeaders = {
    xV: loadVersionField("x-v") || state.vHeaders.xV,
    xMinV: loadVersionField("x-min-v") || state.vHeaders.xMinV
  }
  switch (action.type) {
    case LOAD_VERSION_INFO:
      return {vHeaders}
    case SAVE_VERSION_INFO:
      const vi = action.versionInfo
      saveVersionField("x-v", vi.xV)
      saveVersionField("x-min-v", vi.xMinV)
      return {vHeaders: vi}
    case SET_VERSIONS_EDITABLE:
      return {editable: true, vHeaders}
    case SET_VERSIONS_READ_ONLY:
      return {vHeaders}
    default:
      return state
  }
}

const DEPRECATED_VERSIONS = ['4']

function loadVersionField(vf) {
  const val = window.localStorage.getItem(vf)
  if (vf === 'x-v' && DEPRECATED_VERSIONS.includes(val)) {
    window.localStorage.removeItem(vf)
    return null
  }
  return val
}

function saveVersionField(vf, value) {
  window.localStorage.setItem(vf, value)
}
