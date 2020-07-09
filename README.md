![hooked-2x](https://user-images.githubusercontent.com/2415156/82620918-b531b980-9ba7-11ea-8d48-369160ff18b5.jpg)

---

![Tests](https://github.com/harryhope/hooked-on-redux/workflows/Tests/badge.svg?branch=master)

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
      <button onClick={() => setCount(count + 1)}>Click Me</button>
    </main>
  )
}
```

## Getting Started

### Installation
Hooked on Redux requires `react-redux` as a peer dependency. You'll also need `react`, `react-dom`, and `redux` if you don't have them installed already. This guide also assumes you are using npm and a module bundler like [webpack](https://webpack.js.org). To get started:
```
npm i hooked-on-redux react-redux redux react-dom react
```

### Importing Dependencies
Hooked on Redux works with Redux and React, so we need to install all of the typical dependencies as well as `hooked-on-redux`.

Hooked on Redux can also work with your existing React/Redux app, so if you already have React and Redux installed you can skip importing from `react`, `react-dom`, `redux` and `react-redux`.

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import {createHookedOnReducer, useHookedOnState} from 'hooked-on-redux'
```

### The Store
Hooked on Redux uses a Redux store (either a new or existing one) along with a reducer creator called `createHookedOnReducer`. This reducer creator will automatically manage state transformations so you won't need to think about reducers, actions or action creators.

```jsx
const reducer = createHookedOnReducer()
const store = createStore(reducer, {})
```

### Provider 
Hooked on Redux leverages the `<Provider />` component from `react-redux`. If you've ever used Redux with React before you are probably already familiar with this step. In fact, most of this code should look identical to the [react-redux](https://react-redux.js.org/introduction/quick-start#provider) quick start guide.

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

`useHookedOnState` is a [react hook](https://reactjs.org/docs/hooks-intro.html) that looks and functions similar to the [`useState`](https://reactjs.org/docs/hooks-state.html) hook. The only difference is it allows you to update a Redux store instead of local component state by specifying a slice of the global state to modify along with a default value in case nothing is there.

```jsx
const Counter = props => {
  const [count, setCount] = useHookedOnState('app.components.counterValue', 0)
  return (
    <main>
      <p>You clicked {count} times.</p>
      <button onClick={() => setCount(count + 1)}>Click Me</button>
    </main>
  )
}
```

Now, whenever you use the `setCount` function you defined, it will immutably update the Redux store to look like:
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

## API

### createHookedOnReducer
```js
createHookedOnReducer(initialState, namespace, handlers)
```

Creates a Redux reducer meant to be used with [`createStore`](https://redux.js.org/api/createstore#createstorereducer-preloadedstate-enhancer).

**Arguments**

`initialState`: _(any)_ The initial state of the slice of the Redux store controlled by the hooked-on-reducer. Use this parameter to define pre-existing state. **Default value:** `{}`

`namespace`: _(string)_ Hooked on Redux generates Redux actions behind the scenes without you having to do anything. To allow interoperability with other actions, Hooked on Redux prefixes its own actions with a string. Anything with this string will be funneled through the hooked-on-reducer this function creates. **Default Value:** `'HOOKED_ON_REDUX'`

`handlers`: _(object)_ If you need to add your own reducers to handle complicated state transforms or leverage existing reducers in your application, you can pass them through to `handlers`. For more information, see [Complex Actions](https://github.com/algolia/redux-updeep#complex-actions) in `redux-updeep` (which this library is built upon).

```js
export default createHookedOnReducer(initialState, 'MY_NAMESPACE', {
  'MY_NAMESPACE/COMPLEX_ACTION': (state, action) => {
    return complexTransformation(state, action.payload)
  }
})
```

**Returns:** _(function)_ This function returns a function that can be used in Redux's `createStore`.

---

### useHookedOnState
```js
useHookedOnState(selector, defaultState, namespace)
```

**Arguments**

`selector`: _(string)_ Takes a path string similar to what you would use in [lodash's `_.set`](https://lodash.com/docs/4.17.15#set). This path specifies the "slice" of the store that you will be modifying.

`defaultState`: _(any)_ This is the default value that will be used if the "slice" of the store specified by `selector` is empty. It works very similarly to [`useState`](https://reactjs.org/docs/hooks-state.html)'s default state.

`namespace`: _(string)_ If you are using a custom namespace for `createHookedOnReducer` then you must specify that namespace as the third parameter. If you are not using a default namespace then you can ignore this. **Default Value:** `'HOOKED_ON_REDUX'`

**Returns:** _(array)_ `[value, updateValue]` This function returns a "tuple" much like [`useState`](https://reactjs.org/docs/hooks-state.html). The first array element `value` is the value at the slice of state. The second element of the array `updateValue` is a function that accepts a single parameter that updates the global state at the slice of state specified by `selector`.

## Prior Art
Hooked on Redux builds very heavily on existing libraries and concepts. Under-the-hood it leverages [updeep](https://github.com/substantial/updeep) and [redux-updeep](https://github.com/algolia/redux-updeep) to do most of the work updating the state tree, and the library is particularly inspired by redux-updeep: See [How we reduced boilerplate and handled asynchronous actions with redux](https://blog.algolia.com/how-we-reduced-boilerplate-and-handled-asynchronous-actions-with-redux/).
