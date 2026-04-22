import { useState, useEffect } from "react";

export function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key);
    return saved !== null ? JSON.parse(saved) : defaultValue;
  });

  // Re-initialize when key changes (e.g. user switches account)
  useEffect(() => {
    const saved = localStorage.getItem(key);
    setValue(saved !== null ? JSON.parse(saved) : defaultValue);
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (value === null || value === undefined) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, value]);

  return [value, setValue];
}
