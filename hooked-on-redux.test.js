import React from 'react'
import { render, fireEvent, getNodeText } from '@testing-library/react'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import { createHookedOnReducer, useHookedOnState } from './index'

const Counter = props => {
  const [value, updateValue] = useHookedOnState('app.counterValue', 0, props.options)
  const [, updateAll] = useHookedOnState('app', {})
  return (
    <main>
      <div><button data-testid='deincrement' onClick={() => updateValue(value - 1)}>-</button></div>
      <div data-testid='countervalue'>{value}</div>
      <div><button data-testid='increment' onClick={() => updateValue(value + 1)}>+</button></div>
      <div><button data-testid='set' onClick={() => updateAll({ counterValue: 42 })}>Set to 42</button></div>
    </main>
  )
}

const TodoList = props => {
  const [list, updateList] = useHookedOnState('list', ['milk'])
  const mutateList = () => {
    list.push('eggs')
    list.push('bread')
    list.push('taters')
    updateList(list)
  }
  return (
    <main>
      <div data-testid='list'>
        {list.map(item => `${item},`)}
        ...
      </div>
      <button
        data-testid='add'
        onClick={mutateList}
      />
      <button
        data-testid='replace'
        onClick={() => updateList(['cookies', 'candy', 'cheese whiz'])}
      />
    </main>
  )
}

const AddressBook = props => {
  const [fields, updateFields] = useHookedOnState('fields.user1', {
    first: 'Darth',
    last: 'Vader',
    planet: 'Hoth'
  })

  const updateAll = () => {
    updateFields({ ...fields, last: 'Maul', password: 12345 })
  }

  return (
    <main>
      <div data-testid='details'>{fields.first} {fields.last} {fields.planet} {fields.password}</div>
      <button data-testid='update' onClick={updateAll}>Update</button>
    </main>
  )
}

describe('HookedOnRedux', () => {
  it('should increment and deincrement a counter', () => {
    const reducer = createHookedOnReducer()
    const store = createStore(reducer, {})

    const App = () =>
      <Provider store={store}>
        <Counter />
      </Provider>

    const { getByTestId } = render(<App />)

    const counter = getByTestId('countervalue')
    const increment = getByTestId('increment')
    const deincrement = getByTestId('deincrement')
    const set = getByTestId('set')

    expect(getNodeText(counter)).toBe('0')
    fireEvent.click(increment)
    expect(getNodeText(counter)).toBe('1')
    fireEvent.click(increment)
    expect(getNodeText(counter)).toBe('2')
    ;[1, 2, 3].forEach(() => fireEvent.click(deincrement))
    expect(getNodeText(counter)).toBe('-1')
    fireEvent.click(set)
    expect(getNodeText(counter)).toBe('42')
    fireEvent.click(increment)
    expect(getNodeText(counter)).toBe('43')
  })
  it('should allow an initial state', () => {
    const reducer = createHookedOnReducer()
    const store = createStore(reducer, { app: { counterValue: 5 } })

    const App = () =>
      <Provider store={store}>
        <Counter />
      </Provider>

    const { getByTestId } = render(<App />)

    const counter = getByTestId('countervalue')
    const increment = getByTestId('increment')

    expect(getNodeText(counter)).toBe('5')
    fireEvent.click(increment)
    expect(getNodeText(counter)).toBe('6')
  })
  it('should allow immutable updates on arrays', () => {
    const reducer = createHookedOnReducer()
    const store = createStore(reducer)

    const App = () =>
      <Provider store={store}>
        <TodoList />
      </Provider>

    const { getByTestId } = render(<App />)

    const list = getByTestId('list')
    const addItems = getByTestId('add')
    const replaceItems = getByTestId('replace')

    expect(getNodeText(list)).toBe('milk,...')
    fireEvent.click(addItems)
    expect(getNodeText(list)).toBe('milk,eggs,bread,taters,...')
    fireEvent.click(replaceItems)
    expect(getNodeText(list)).toBe('cookies,candy,cheese whiz,...')
  })
  it('should predictably update objects', () => {
    const reducer = createHookedOnReducer()
    const store = createStore(reducer)

    const App = () =>
      <Provider store={store}>
        <AddressBook />
      </Provider>

    const { getByTestId } = render(<App />)

    const details = getByTestId('details')
    const update = getByTestId('update')

    expect(getNodeText(details)).toBe('Darth Vader Hoth ')
    fireEvent.click(update)
    expect(getNodeText(details)).toBe('Darth Maul Hoth 12345')
  })
  it('should allow a namespace w/a string', () => {
    const reducer = createHookedOnReducer({}, 'MY_NAMESPACE')
    const store = createStore(reducer, { app: { counterValue: 2 } })

    const App = () =>
      <Provider store={store}>
        <Counter options='MY_NAMESPACE' />
      </Provider>

    const { getByTestId } = render(<App />)

    const counter = getByTestId('countervalue')
    const increment = getByTestId('increment')

    expect(getNodeText(counter)).toBe('2')
    fireEvent.click(increment)
    expect(getNodeText(counter)).toBe('3')
  })
  it('should allow a namespace in an options object', () => {
    const reducer = createHookedOnReducer({}, 'MY_NAMESPACE2')
    const store = createStore(reducer, { app: { counterValue: 5 } })

    const App = () =>
      <Provider store={store}>
        <Counter options={{ namespace: 'MY_NAMESPACE2' }} />
      </Provider>

    const { getByTestId } = render(<App />)

    const counter = getByTestId('countervalue')
    const increment = getByTestId('increment')

    expect(getNodeText(counter)).toBe('5')
    fireEvent.click(increment)
    expect(getNodeText(counter)).toBe('6')
  })
  it('should allow setting a root path to work with combined reducers', () => {
    const counterReducer = createHookedOnReducer()
    const otherReducer = (state = {}) => state
    const reducers = combineReducers({ counterReducer, otherReducer })

    const store = createStore(reducers, { counterReducer: { app: { counterValue: 3 } } })

    const App = () =>
      <Provider store={store}>
        <Counter options={{ rootPath: 'counterReducer' }} />
      </Provider>
    const { getByTestId } = render(<App />)

    const counter = getByTestId('countervalue')
    const increment = getByTestId('increment')

    expect(getNodeText(counter)).toBe('3')
    fireEvent.click(increment)
    expect(getNodeText(counter)).toBe('4')
  })
})
