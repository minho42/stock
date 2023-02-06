import { useState, useEffect } from "react";

const getLocalStorageValue = (key: string, initialValue: any) => {
  // console.log("getLocalStorageValue: " + key);
  const value = JSON.parse(localStorage.getItem(key));
  // console.log(`key: ${key}, value: ${value}, initialValue: ${initialValue}`);
  if (value !== null) {
    return value;
  }
  if (initialValue instanceof Function) {
    return initialValue();
  }
  return initialValue;
};

const setLocalStorageValue = (key: string, value: string) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(error.message);
  }
};

export const useLocalStorage = (key: string, initialValue: any) => {
  const [value, setValue] = useState(() => {
    return getLocalStorageValue(key, initialValue);
  });
  useEffect(() => {
    setLocalStorageValue(key, value);
  }, [value]);

  return [value, setValue];
};
