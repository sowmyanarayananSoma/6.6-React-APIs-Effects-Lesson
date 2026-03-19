# useState vs useReducer — Deep Dive
> When to use each and why

---

## The problem with multiple useState calls

`useState` works well when state values are independent of each other. The moment multiple pieces of state need to update together in response to the same action, managing them separately becomes fragile.

Consider a shopping cart. With `useState`, each piece of state lives on its own:

```jsx
const [items, setItems] = useState([]);
const [totalPrice, setTotalPrice] = useState(0);
const [itemCount, setItemCount] = useState(0);
const [discount, setDiscount] = useState(0);
const [isCheckingOut, setIsCheckingOut] = useState(false);
```

Now when a user adds an item, you have to manually keep all of these in sync inside every action:

```jsx
function addItem(item) {
  setItems([...items, item]);             // setter call 1
  setTotalPrice(totalPrice + item.price); // setter call 2
  setItemCount(itemCount + 1);            // setter call 3
  // discount? isCheckingOut? easy to forget
}

function removeItem(item) {
  setItems(items.filter(i => i.id !== item.id)); // setter call 1
  setTotalPrice(totalPrice - item.price);         // setter call 2
  setItemCount(itemCount - 1);                    // setter call 3
  // again — discount and isCheckingOut not touched
}
```

Every action requires multiple coordinated `set` calls. Miss one and your state falls out of sync — your item count says 3 but your items array only has 2. These bugs are silent and hard to trace.

---

## What useReducer does differently

`useReducer` moves all the state update logic into one function — the reducer. Instead of calling multiple setters, you `dispatch` a single action describing what happened, and the reducer decides how every field should change in response.

```jsx
import { useReducer } from "react";

// All state lives together in one object
const initialState = {
  items: [],
  totalPrice: 0,
  itemCount: 0,
  discount: 0,
  isCheckingOut: false,
};

// The reducer — one place where all update logic lives
function cartReducer(state, action) {
  switch (action.type) {
    case "add_item":
      return {
        ...state,
        items: [...state.items, action.item],
        totalPrice: state.totalPrice + action.item.price,
        itemCount: state.itemCount + 1,
      };
    case "remove_item":
      return {
        ...state,
        items: state.items.filter(i => i.id !== action.item.id),
        totalPrice: state.totalPrice - action.item.price,
        itemCount: state.itemCount - 1,
      };
    case "apply_discount":
      return {
        ...state,
        discount: action.amount,
        totalPrice: state.totalPrice * (1 - action.amount),
      };
    case "checkout":
      return {
        ...state,
        isCheckingOut: true,
      };
    case "reset":
      return initialState;
    default:
      return state;
  }
}

export default function Cart() {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  return (
    <div>
      <p>Items: {state.itemCount}</p>
      <p>Total: ${state.totalPrice.toFixed(2)}</p>

      <button onClick={() => dispatch({ type: "add_item", item: { id: 1, name: "Latte", price: 5.50 } })}>
        Add Latte
      </button>

      <button onClick={() => dispatch({ type: "apply_discount", amount: 0.1 })}>
        Apply 10% discount
      </button>

      <button onClick={() => dispatch({ type: "checkout" })}>
        Checkout
      </button>
    </div>
  );
}
```

Adding an item is now a single dispatch call:

```jsx
dispatch({ type: "add_item", item: { id: 1, name: "Latte", price: 5.50 } });
```

The reducer handles updating `items`, `totalPrice`, and `itemCount` atomically — they can never fall out of sync because they all update inside the same `case` block.

---

## What does `state` refer to inside the reducer?

This is a common point of confusion. The `state` parameter in the reducer is **not** the entire state of the page. It is only the object you passed as the second argument to `useReducer` when you set it up:

```jsx
const [state, dispatch] = useReducer(cartReducer, initialState);
//                                                 ^^^^^^^^^^^^
//                         this object — and only this object — is what `state` refers to
```

If your page also has a `useState` for a sidebar toggle, or a separate `useReducer` for a login form, the cart reducer has no knowledge of them. Each `useReducer` manages its own isolated slice of state.

```jsx
// These are completely separate — the cart reducer knows nothing about sidebarOpen
const [sidebarOpen, setSidebarOpen] = useState(false);
const [state, dispatch] = useReducer(cartReducer, initialState);
```

---

## Side by side

| | `useState` | `useReducer` |
|---|---|---|
| State structure | Separate variables | One object with named fields |
| How you update | Call individual setters | Dispatch an action |
| Update logic lives | Scattered across handler functions | In one reducer function |
| Risk | Fields fall out of sync | Contained — all updates in one place |
| Best for | Simple, independent values | Multiple related fields updated together |

---

## When to reach for useReducer

The clearest signal is when a single user action requires updating more than one piece of state at the same time. If you find yourself writing three or more coordinated `set` calls inside the same handler, that handler is a candidate for a reducer action instead.