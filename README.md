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
Hooked on Redux requires react-redux as a peer dependency. To get started:
```
npm i hooked-on-redux react-redux
```
