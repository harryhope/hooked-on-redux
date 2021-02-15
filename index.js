import get from 'lodash/get'
import set from 'lodash/set'
import cloneDeep from 'lodash/cloneDeep'
import isString from 'lodash/isString'
import isArray from 'lodash/isArray'
import { useSelector, useDispatch } from 'react-redux'

const defaultReducer = (state, { payload, path = '' }) => {
  set(state, path, payload)
  return cloneDeep(state)
}

export const createHookedOnReducer = (initialState = {}, namespace = 'HOOKED_ON_REDUX', handlers = {}) => {
  const namespaceRegexp = new RegExp(`^${namespace}/`)
  return function hookedOnReducer (state = initialState, action) {
    if (Object.prototype.hasOwnProperty.call(handlers, action.type)) {
      return handlers[action.type](state, action)
    } else if (namespaceRegexp.test(action.type)) {
      return defaultReducer(state, action)
    }
    return state
  }
}

export const useHookedOnState = (selector, defaultState, options = {}) => {
  const namespace = isString(options) ? options : get(options, 'namespace', 'HOOKED_ON_REDUX')
  const rootPath = get(options, 'rootPath')
  const value = useSelector(state =>
    get(state, rootPath ? `${rootPath}.${selector}` : selector, defaultState)
  )

  const dispatch = useDispatch()

  const updateValue = newValue =>
    dispatch({
      payload: isArray(newValue) ? newValue.slice() : newValue,
      path: selector,
      type: `${namespace}/${selector}`
    })

  return [value, updateValue]
}
