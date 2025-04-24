
# react-use-local-storage-state

A simple React hook to persist state to [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).  
Easily keep your app's state in sync with the browser's storage, so your users' data survives page reloads.

---

## Features

- **Drop-in replacement for `useState`**: Same API, just add a key!
- **Automatic persistence**: State is saved to and loaded from `localStorage`.
- **TypeScript support**: Fully typed for a great developer experience.
- **SSR-safe**: Handles server-side rendering gracefully.

---

## Installation

```bash
npm install react-use-local-storage-state
```

or

```bash
yarn add react-use-local-storage-state
```

---

## Usage

```tsx
import useLocalStorageState from "react-use-local-storage-state";

function Counter() {
  const [count, setCount] = useLocalStorageState("my-counter", 0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
    </div>
  );
}
```

### With complex values

You can store objects, arrays, or any JSON-serializable value:

```tsx
const [user, setUser] = useLocalStorageState("user", { name: "Alice" });
```

### With lazy initialization

You can pass a function as the initial value (just like `useState`):

```tsx
const [value, setValue] = useLocalStorageState("expensive", () => computeInitial());
```

---

## API

```ts
const [state, setState] = useLocalStorageState<T>(
  key: string,
  initialValue: T | (() => T)
);
```

- **`key`**: The `localStorage` key to use.
- **`initialValue`**: The initial value, or a function returning the initial value.
- **Returns**: `[state, setState]` — just like `useState`.

---

## How it works

- On mount, the hook checks `localStorage` for the given key.
  - If found, it parses and uses that value.
  - If not, it uses the provided `initialValue`.
- Whenever the state changes, it is saved to `localStorage`.
- Handles errors gracefully and works in SSR environments.

---

## Caveats

- **No cross-tab sync**: Changes in one tab are not automatically reflected in others.
- **JSON serialization**: Only JSON-serializable values are supported.
- **Storage limits**: `localStorage` has size limits (usually ~5MB).

---

## License

MIT

---

## Credits

Inspired by the React community and the need for simple persistent state.