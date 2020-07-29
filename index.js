import get from 'lodash/get'
import isArray from 'lodash/isArray'
import createReducer from 'redux-updeep'
import { constant } from 'updeep'
import { useSelector, useDispatch } from 'react-redux'

export const createHookedOnReducer = (initialState = {}, namespace = 'HOOKED_ON_REDUX', handlers = {}) =>
  createReducer(namespace, initialState, handlers)

export const useHookedOnState = (selector, defaultState, namespace = 'HOOKED_ON_REDUX') => {
  const value = useSelector(state =>
    get(state, selector, defaultState)
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


export const useComplexHookedOnState = (
  selector,
  reducer,
  defaultState,
  namespace = "HOOKED_ON_REDUX"
) => {
  const value = useSelector(state =>
    get(state, `${reducer}.${selector}`, defaultState)
  );

  const dispatch = useDispatch();

  const updateValue = newValue =>
    dispatch({
      payload: isArray(newValue) ? constant(newValue) : newValue,
      path: selector,
      type: `${namespace}/${selector}`
    });

  return [value, updateValue];
};
