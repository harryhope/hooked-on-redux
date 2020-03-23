import { constant } from 'updeep'
import get from 'lodash/get'
import isArray from 'lodash/isArray'
import {createReducer as createUpdeepReducer} from 'redux-updeep'
import {useSelector, useDispatch} from 'react-redux'

export const createReducer = (initialState = {}, namespace = 'REDACT', handlers = {}) =>
  createUpdeepReducer(namespace, initialState, handlers)

export const useRedactState = (selector, defaultState, namespace = 'REDACT') => {
  const value = useSelector(state =>
    _.get(state, selector, defaultState)
  )

  const dispatch = useDispatch()

  const updateValue = newValue =>
    dispatch({
      payload: isArray(newValue) ? constant(newValue) : newValue,
      path: selector,
      type: `${namespace}/${selector}`
    })

  return [value, updateValue]
}
