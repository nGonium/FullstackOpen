# useReducer

A reducer manages state by dispatching actions. An action is an object with a `type` and (optionally) `payload` field. When dispatched, the reducer uses a switch statement to return an appropriate state based on the action.

```js
const initialState = {
  todos: []
}
const todoReducer = (state = initialState, action) => {
  const { type, payload } = action
  switch (type) {
    case 'todo/add': {
      ...state,
      todos: todos.concat(payload)
    }
    // etc...
    default: throw new Error(`invalid action of type "${type}"`)
  }
}
```

## Context

Context can help share data across an application without prop-drilling, instead relying on a `Provider`

```js
const TodoContext = createContext(initialState);

const TodoContextProvider = ({ children }) => {
  const [todos, dispatchTodos] = useReducer(todoReducer);

  const addTodo = (todo) => dispatch({ type: 'todo/add', payload: todo });

  const value = {
    todos,
    addTodo,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};
```

The values provided by the provider can be used in any of its descendent components by using the `useContext` hook
