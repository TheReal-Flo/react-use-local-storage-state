import { useState, useEffect } from "react";

export function createLocalStorageStateHook<T>(key: string, initialValue: T | (() => T)) {
  return function useCustomLocalStorageState(): [T, React.Dispatch<React.SetStateAction<T>>] {
    return useLocalStorageState<T>(key, initialValue);
  };
}

/**
 * useLocalStorageState
 * A React hook that persists state to localStorage.
 *
 * @param key - The localStorage key to use.
 * @param initialValue - The initial value or a function returning the initial value.
 * @returns [state, setState] - Just like useState.
 */
function useLocalStorageState<T>(
  key: string,
  initialValue: T | (() => T)
): [T, React.Dispatch<React.SetStateAction<T>>] {
  // Helper to get the initial value from localStorage or fallback
  const getStoredValue = (): T => {
    if (typeof window === "undefined") {
      // SSR fallback
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
      console.warn(`Error reading localStorage key "${key}":`, error);
    }
    return typeof initialValue === "function"
      ? (initialValue as () => T)()
      : initialValue;
  };

  const [state, setState] = useState<T>(getStoredValue);

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, state]);

  return [state, setState];
}

export default useLocalStorageState;