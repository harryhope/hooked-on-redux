import React from 'react'
import ReactDOM from 'react-dom'
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import {createHookedOnReducer, useHookedOnState} from '../index'

const reducer = createHookedOnReducer()
const store = createStore(reducer, {})

const App = props => {
  const [value, updateValue] = useHookedOnState('app.counterValue', 0)
  return (
    <main>
      <div><button onClick={() => updateValue(value - 1)}>-</button></div>
      <div>{value}</div>
      <div><button onClick={() => updateValue(value + 1)}>+</button></div>
    </main>
  )
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
)
