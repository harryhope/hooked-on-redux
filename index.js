import get from 'lodash/get'
import isString from 'lodash/isString'
import isArray from 'lodash/isArray'
import createReducer from 'redux-updeep'
import { useSelector, useDispatch } from 'react-redux'

export const createHookedOnReducer = (initialState = {}, namespace = 'HOOKED_ON_REDUX', handlers = {}) =>
  createReducer(namespace, initialState, handlers)

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
