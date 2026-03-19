# Fetch & State Management — Concept Reference
> Fetching Data · useEffect · Loading & Error States · useState vs useReducer

---

## 1. Fetching Data with JavaScript

Before using fetch in React, it helps to understand the two ways to write it in plain JavaScript.

### `.then()` chaining

```js
fetch("https://api.example.com/items")
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

Each `.then()` receives the result of the previous step. `.catch()` handles any error in the chain.

### `async/await`

```js
async function getItems() {
  try {
    const response = await fetch("https://api.example.com/items");
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}
```

`await` pauses execution until the promise resolves. `try/catch` replaces `.catch()`.

> Both approaches do the same thing. `async/await` is generally easier to read and is the preferred style in React components.

---

## 2. Fetching Inside a React Component

Fetch calls in React belong inside a `useEffect` hook. This ensures the fetch runs *after* the component renders, not during it.

### What is `useEffect`?

`useEffect` lets you run code in response to something — a render, a state change, or a component mounting. It takes two arguments: a function to run, and a dependency array.

```jsx
useEffect(() => {
  // code to run
}, [/* dependency array */]);
```

The dependency array controls *when* the effect runs. There are three versions of it, and each behaves differently.

---

#### Empty array `[]` — run once on mount

```jsx
useEffect(() => {
  console.log("Component appeared on screen");
}, []);
```

The effect runs exactly once — after the very first render. It does not run again, even if state or props change. This is the right choice when you want to fetch data that doesn't depend on anything else in the component.

---

#### Array with values `[someValue]` — run when a value changes

```jsx
useEffect(() => {
  console.log("Category changed to:", category);
}, [category]);
```

The effect runs after the first render, and then again every time `category` changes. You can list more than one dependency — the effect re-runs whenever any of them changes.

This is the right choice when your effect depends on a piece of state or a prop. A common example is fetching different data based on a user's selection:

```jsx
import { useState, useEffect } from "react";

export default function MenuList() {
  const [category, setCategory] = useState("coffee");
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function fetchItems() {
      const response = await fetch(`https://api.example.com/menu?category=${category}`);
      const data = await response.json();
      setItems(data);
    }

    fetchItems();
  }, [category]); // re-runs every time category changes

  return (
    <div>
      <select onChange={e => setCategory(e.target.value)} value={category}>
        <option value="coffee">Coffee</option>
        <option value="food">Food</option>
        <option value="drinks">Drinks</option>
      </select>

      <ul>
        {items.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

When the user picks a different category, `category` state updates, which triggers the effect, which fetches the new data. The URL changes with each fetch because `category` is interpolated directly into it.

> If `category` is used inside the effect, it belongs in the dependency array. A good rule: anything from the component that the effect reads or depends on should be listed as a dependency.

---

### Why can't the fetch just go directly in the component body?

Since `category` is already state, and state changes cause a re-render, it might seem like you could skip `useEffect` entirely and just call fetch at the top of the component:

```jsx
// ❌ Do not do this
export default function MenuList() {
  const [category, setCategory] = useState("coffee");
  const [items, setItems] = useState([]);

  // This runs during every render — not just when category changes
  async function fetchItems() {
    const response = await fetch(`https://api.example.com/menu?category=${category}`);
    const data = await response.json();
    setItems(data); // ⚠️ calling setItems triggers another render...
  }

  fetchItems(); // ...which calls fetchItems again...which calls setItems again...

  return ( /* ... */ );
}
```

This creates an **infinite loop**:

```
render → fetchItems() runs → setItems(data) → re-render → fetchItems() runs → setItems(data) → re-render → ...
```

The component never settles. Every render triggers a fetch, and every fetch triggers a render.

There's a second problem too. Even if you somehow avoided the infinite loop, code in the component body runs on *every* render — not just when `category` changes. An unrelated state update elsewhere in the component (a hover effect, an open/close toggle, anything) would kick off a new fetch request unnecessarily.

`useEffect` with `[category]` solves both problems:

- It runs *after* the render is committed to the screen, so `setItems` inside it doesn't cause the current render to loop
- React tracks the dependency array and only re-runs the effect when `category` actually changed — not on every render regardless of cause

```jsx
// ✅ Correct
useEffect(() => {
  async function fetchItems() {
    const response = await fetch(`https://api.example.com/menu?category=${category}`);
    const data = await response.json();
    setItems(data); // triggers a re-render, but useEffect does NOT re-run unless category changes
  }

  fetchItems();
}, [category]);
```

> The fetch fires → `setItems` updates state → the component re-renders → React checks: did `category` change? No → `useEffect` does not run again. The loop is broken.

---

#### No array at all — run after every render

```jsx
useEffect(() => {
  console.log("This runs after every single render");
});
```

Without a dependency array, the effect runs after every render — including renders caused by state changes. This is rarely what you want, and almost never the right choice for a fetch call, since it would fire a new request on every keystroke, click, or any other update.

---

#### Summary

| Dependency array | When the effect runs |
|---|---|
| `[]` | Once, after the first render |
| `[value]` | After the first render, and whenever `value` changes |
| `[a, b]` | After the first render, and whenever `a` or `b` changes |
| *(no array)* | After every render |

---

### Fetching data on mount

```jsx
import { useState, useEffect } from "react";

export default function MenuList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function fetchItems() {
      const response = await fetch("https://api.example.com/menu");
      const data = await response.json();
      setItems(data);
    }

    fetchItems();
  }, []);

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

> The `async` function is defined *inside* `useEffect` and then called immediately. You can't make the `useEffect` callback itself `async` — define a named function inside it instead.

---

## 3. Loading and Error States

A fetch call has three possible outcomes: it's in progress, it succeeded, or it failed. Each should render something different.

### The three-state pattern

```jsx
import { useState, useEffect } from "react";

export default function MenuList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchItems() {
      try {
        const response = await fetch("https://api.example.com/menu");

        if (!response.ok) {
          throw new Error("Failed to fetch menu items.");
        }

        const data = await response.json();
        setItems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

**What each piece does:**

- `loading` starts as `true` and flips to `false` in `finally` — whether the fetch succeeded or failed
- `error` stays `null` on success; gets set to the error message on failure
- `if (!response.ok)` catches HTTP errors (like 404 or 500) that `fetch` does not throw on its own
- The early `return` statements for `loading` and `error` mean the list only renders when data is ready

> **Note on `setItems` and re-renders:** `setItems(data)` does not immediately pause execution and re-render. JavaScript finishes the entire function first — including `finally`. React then batches `setItems` and `setLoading` together and processes them in a single re-render. This is why the loading spinner disappears and the data appears at the same time, not in two separate flashes.

---

### Upgrading the loading state with MUI

Right now the loading state renders a plain `<p>Loading...</p>`. MUI's `CircularProgress` component is a drop-in replacement that gives you a proper loading spinner.

```jsx
import { CircularProgress, Box } from "@mui/material";

if (loading) return (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
    <CircularProgress />
  </Box>
);
```

`CircularProgress` accepts props to control its appearance:

- `size` — diameter in pixels, e.g. `size={60}`
- `color` — any MUI palette color: `"primary"`, `"secondary"`, `"inherit"`
- `thickness` — how thick the ring is, default is `3.6`

```jsx
<CircularProgress size={60} color="secondary" thickness={5} />
```

`Box` is used here purely for centering — `display="flex"` with `justifyContent` and `alignItems` centers the spinner both horizontally and vertically within the given height.

---

## 4. `useState` vs `useReducer`

Both manage state in a component. `useReducer` is better suited when state logic becomes complex or when multiple pieces of state change together.

### `useState` — simple, independent values

```jsx
const [count, setCount] = useState(0);

function increment() {
  setCount(count + 1);
}

function decrement() {
  setCount(count - 1);
}

function reset() {
  setCount(0);
}
```

Works well when each state update is straightforward and independent.

---

### `useReducer` — complex state with multiple actions

`useReducer` separates *what happened* (the action) from *how state changes* (the reducer function). This makes the logic easier to follow and test as it grows.

```jsx
import { useReducer } from "react";

// 1. Define the reducer — a pure function that returns the new state
function counterReducer(state, action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    case "reset":
      return { count: 0 };
    default:
      return state;
  }
}

export default function Counter() {
  // 2. useReducer takes the reducer function and an initial state
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });

  return (
    <div>
      <p>Count: {state.count}</p>
      {/* 3. dispatch sends an action object to the reducer */}
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
      <button onClick={() => dispatch({ type: "decrement" })}>−</button>
      <button onClick={() => dispatch({ type: "reset" })}>Reset</button>
    </div>
  );
}
```

**Three parts to know:**

- **Reducer function** — receives current state and an action, returns the next state. Never mutates state directly.
- **`dispatch`** — call it with an action object to trigger a state update. Convention is to use a `type` string to identify the action.
- **`action`** — a plain object. `type` identifies what happened; you can add extra data as needed (e.g. `{ type: "setName", value: "Alex" }`).

---

## 5. Choosing Between `useState` and `useReducer`

| Situation | Prefer |
|---|---|
| One or two independent values | `useState` |
| State is a boolean, string, or number | `useState` |
| Multiple related fields that update together | `useReducer` |
| Several different actions that change the same state | `useReducer` |
| State logic is getting hard to follow | `useReducer` |
| You want all state transitions in one place | `useReducer` |

> A common rule of thumb: if you find yourself writing three or more `useState` calls that are all connected, `useReducer` is worth considering.

Go here for detailed explanation-[Reducer vs State](StatevsReducer.md)