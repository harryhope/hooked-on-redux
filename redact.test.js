import React from 'react'
import ReactDOM from 'react-dom'
import {render, fireEvent, getNodeText} from '@testing-library/react'
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import {createRedactReducer, useRedactState} from './index'

const Counter = props => {
  const [value, updateValue] = useRedactState('app.counterValue', 0)
  const [,updateAll] = useRedactState('app', {})
  return (
    <main>
      <div><button data-testid="deincrement" onClick={() => updateValue(value -1)}>-</button></div>
      <div data-testid="countervalue">{value}</div>
      <div><button data-testid="increment" onClick={() => updateValue(value + 1)}>+</button></div>
      <div><button data-testid="set" onClick={() => updateAll({counterValue: 42})}>Set to 42</button></div>
    </main>
  )
}

const TodoList = props => {
  const [list, updateList] = useRedactState('list', ['milk'])
  return (
    <main>
      <div data-testid="list">
        {list.map(item => `${item},`)}
        ...
      </div>
      <button
        data-testid="add"
        onClick={() => updateList(list.concat(['eggs', 'bread', 'taters']))}
      />
    </main>
  )
}

describe('Redact', () => {
  it('should increment and deincrement a counter', () => {
    const reducer = createRedactReducer()
    const store = createStore(reducer, {})

    const App = () =>
      <Provider store={store}>
        <Counter/>
      </Provider>

    const {container, getByTestId } = render(<App />)

    const counter = getByTestId('countervalue')
    const increment = getByTestId('increment')
    const deincrement = getByTestId('deincrement')
    const set = getByTestId('set')

    expect(getNodeText(counter)).toBe('0')
    fireEvent.click(increment)
    expect(getNodeText(counter)).toBe('1')
    fireEvent.click(increment)
    expect(getNodeText(counter)).toBe('2')
    ;[1,2,3].forEach(() => fireEvent.click(deincrement))
    expect(getNodeText(counter)).toBe('-1')
    fireEvent.click(set)
    expect(getNodeText(counter)).toBe('42')
    fireEvent.click(increment)
    expect(getNodeText(counter)).toBe('43')
  })
  it('should allow an initial state', () => {
    const reducer = createRedactReducer()
    const store = createStore(reducer, {app: {counterValue: 5}})

    const App = () =>
      <Provider store={store}>
        <Counter/>
      </Provider>

    const {container, getByTestId } = render(<App />)

    const counter = getByTestId('countervalue')
    const increment = getByTestId('increment')

    expect(getNodeText(counter)).toBe('5')
    fireEvent.click(increment)
    expect(getNodeText(counter)).toBe('6')
  })
  it('should allow immutable updates on arrays', () => {
    const reducer = createRedactReducer()
    const store = createStore(reducer)

    const App = () =>
      <Provider store={store}>
        <TodoList/>
      </Provider>

    const {container, getByTestId } = render(<App />)

    const list = getByTestId('list')
    const addItems = getByTestId('add')

    expect(getNodeText(list)).toBe('milk,...')
    fireEvent.click(addItems)
    expect(getNodeText(list)).toBe('milk,eggs,bread,taters,...')
  })
})
