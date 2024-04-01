import { useState, useEffect } from "react";

export function useLocalStorageState(initialState, key) {
  const [storage, setStorage] = useState(function () {
    const storedValue = localStorage.getItem(key);
    if (!storedValue) return initialState;
    return JSON.parse(storedValue);
  });

  useEffect(
    function () {
      localStorage.setItem(key, JSON.stringify(storage));
    },
    [storage, key]
  );

  return [storage, setStorage];
}
