import { useState, useEffect } from "react";

export function createLocalStorageStateHook<T>(
  key: string,
  initialValue: T | (() => T)
) {
  return function useCustomLocalStorageState(): [
    T,
    React.Dispatch<React.SetStateAction<T>>,
    { isPersistent: boolean }
  ] {
    return useLocalStorageState<T>(key, initialValue);
  };
}

function isLocalStorageAvailable(): boolean {
  try {
    const testKey = "__test__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * useLocalStorageState
 * A React hook that persists state to localStorage.
 *
 * @param key - The localStorage key to use.
 * @param initialValue - The initial value or a function returning the initial value.
 * @returns [state, setState, { isPersistent }] - Just like useState, and aditionally a boolean if the value is persistent.
 */
function useLocalStorageState<T>(
  key: string,
  initialValue: T | (() => T)
): [T, React.Dispatch<React.SetStateAction<T>>, { isPersistent: boolean }] {
  const persistent = typeof window !== "undefined" && isLocalStorageAvailable();

  const getStoredValue = (): T => {
    if (!persistent) {
      return typeof initialValue === "function"
        ? (initialValue as () => T)()
        : initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        return JSON.parse(item) as T;
      }
    } catch (error) {
      console.error("useLocalStorageState error", error);
    }
    return typeof initialValue === "function"
      ? (initialValue as () => T)()
      : initialValue;
  };

  const [state, setState] = useState<T>(getStoredValue);

  useEffect(() => {
    if (persistent) {
      try {
        window.localStorage.setItem(key, JSON.stringify(state));
      } catch {
        // ignore
      }
    }
  }, [key, state, persistent]);

  return [state, setState, { isPersistent: persistent }];
}

export default useLocalStorageState;
