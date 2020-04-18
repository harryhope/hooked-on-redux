# Hooked On Redux
Hooked on Redux is a [React hook](https://reactjs.org/docs/hooks-intro.html) that lets you wield the power of [Redux](https://redux.js.org) with an interface that's as simple as the [`useState`](https://reactjs.org/docs/hooks-state.html) hook.

Redux is a great way to manage React state and its core principle: [a single, immutable application state](https://redux.js.org/introduction/three-principles), allows for great features like [hot reloading and time travel debugging](https://www.youtube.com/watch?v=xsSnOQynTHs). Unfortunately, Redux is also intimidating to learn for beginners and requires a lot of [boilerplate](https://redux.js.org/recipes/reducing-boilerplate) that can slow down application development and add overhead to your codebase.

Hooked on Redux attempts to address these shortcomings by managing actions, selectors and reducers behind the scenes and exposing a simplified hook that lets you update Redux state in the same way you would update local component state with the `useState` hook.

**It looks like this:**
```jsx
const Example = props => {
  const [count, setCount] = useHookedOnState('app.components.counterValue', 0)
  return (
    <main>
      <p>You clicked {count} times.</p>
      <button onClick={() => setCount(value + 1)}>Click Me</button>
    </main>
  )
}
```

## Getting Started

### Installation
Hooked on Redux requires react-redux as a peer dependency. You'll also need `react`, `react-dom`, and `redux` if you don't have them installed already. This guide also assumes you are using npm and a module bundler like [webpack](https://webpack.js.org). To get started:
```
npm i hooked-on-redux react-redux redux react-dom react
```

### Importing Dependencies
Hooked on Redux works with redux and react, so we need to install all of the typical dependencies as well as `hooked-on-redux`.

Hooked on Redux can also work with your existing react/redux app, so if you already have react and redux installed you can skip importing from `react`, `react-dom`, `redux` and `react-redux`.

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import {createHookedOnReducer, useHookedOnState} from 'hooked-on-redux'
```

### The Store
Hooked on Redux uses a redux store (either a new or existing one) along with a reducer creator called `createHookedOnReducer`. This reducer creator will automatically manage state transformations so you won't need to think about reducers, actions or action creators.

```jsx
const reducer = createHookedOnReducer()
const store = createStore(reducer, {})
```

### Provider 
Hooked on Redux leverages the `<Provider />` component from `react-redux`. If you've ever used redux with react before you are probably already familiar with this step. In fact, most of this code should look identical to the [react-redux](https://react-redux.js.org/introduction/quick-start#provider) quick start guide.

```jsx
ReactDOM.render(
  <Provider store={store}>
    <Counter />
  </Provider>,
  document.getElementById('app')
)
```

### The Hook
You are now ready to start writing components using `useHookedOnState`.

`useHookedOnState` is a [react hook](https://reactjs.org/docs/hooks-intro.html) that looks and functions similar to the [`useState`](https://reactjs.org/docs/hooks-state.html) hook. The only difference is it allows you to update a redux store instead of local component state by specifying a slice of the global state to modify along with a default value in case nothing is there.

```jsx
const Counter = props => {
  const [count, setCount] = useHookedOnState('app.components.counterValue', 0)
  return (
    <main>
      <p>You clicked {count} times.</p>
      <button onClick={() => setCount(value + 1)}>Click Me</button>
    </main>
  )
}
```

Now, whenever you use the `setCount` function you defined, it will immutably update the redux store to look like:
```js
{
  app: {
    components: {
      counterValue: 1
    }
  }
}
```

You can update any slice of the global state this way by providing a path as the first parameter of `useHookedOnState`. The path string parameter works identically to [lodash's `_.set`](https://lodash.com/docs/4.17.15#set).




