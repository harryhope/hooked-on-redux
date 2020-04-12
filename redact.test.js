import React from 'react'
import ReactDOM from 'react-dom'
import {render, fireEvent, getNodeText} from '@testing-library/react'
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import {createHookedOnReducer, useHookedOnState} from './index'

const Counter = props => {
  const [value, updateValue] = useHookedOnState('app.counterValue', 0)
  const [,updateAll] = useHookedOnState('app', {})
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
  const [list, updateList] = useHookedOnState('list', ['milk'])
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

const AddressBook = props => {
  const [fields, updateFields] = useHookedOnState('fields.user1', {
    first: 'Darth',
    last: 'Vader',
    planet: 'Hoth'
  })

  const updateAll = () => {
    updateFields({...fields, last: 'Maul', password: 12345})
  }

  return (
    <main>
      <div data-testid="details">{fields.first} {fields.last} {fields.planet} {fields.password}</div>
      <button data-testid="update" onClick={updateAll}>Update</button>
    </main>
  )
}

describe('HookedOnRedux', () => {
  it('should increment and deincrement a counter', () => {
    const reducer = createHookedOnReducer()
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
    const reducer = createHookedOnReducer()
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
    const reducer = createHookedOnReducer()
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
  it('should predictably update objects', () => {
    const reducer = createHookedOnReducer()
    const store = createStore(reducer)

    const App = () =>
      <Provider store={store}>
        <AddressBook/>
      </Provider>

    const {container, getByTestId } = render(<App />)

    const details = getByTestId('details')
    const update = getByTestId('update')

    expect(getNodeText(details)).toBe('Darth Vader Hoth ')
    fireEvent.click(update)
    expect(getNodeText(details)).toBe('Darth Maul Hoth 12345')
  })
})
