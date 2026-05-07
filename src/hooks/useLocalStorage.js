import { useState, useEffect } from "react";

function readStoredValue(key, defaultValue) {
  const saved = localStorage.getItem(key);
  return saved !== null ? JSON.parse(saved) : defaultValue;
}
export function useLocalStorage(key, defaultValue) {
  const [state, setState] = useState(() => ({
    key,
    value: readStoredValue(key, defaultValue),
  }));
  const value = state.key === key ? state.value : readStoredValue(key, defaultValue);

  const setValue = (nextValue) => {
    setState((current) => {
      const currentValue =
        current.key === key ? current.value : readStoredValue(key, defaultValue);
      const resolvedValue =
        typeof nextValue === "function" ? nextValue(currentValue) : nextValue;
      return { key, value: resolvedValue };
    });
  };
  useEffect(() => {
    if (value === null || value === undefined) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, value]);

  return [value, setValue];
}
