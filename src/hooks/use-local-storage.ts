import { useCallback, useEffect, useState } from "react";

type SetValue<T> = T | ((val: T) => T);

export function useLocalStorage<T>(
	key: string,
	initialValue: T,
): [T, (value: SetValue<T>) => void] {
	// Get from local storage then parse stored json or return initialValue
	const [storedValue, setStoredValue] = useState<T>(() => {
		if (typeof window === "undefined") {
			return initialValue;
		}
		try {
			const item = window.localStorage.getItem(key);
			return item ? JSON.parse(item) : initialValue;
		} catch (error) {
			console.warn(`Error reading localStorage key "${key}":`, error);
			return initialValue;
		}
	});

	// Return a wrapped version of useState's setter function that persists the new value to localStorage
	const setValue = useCallback(
		(value: SetValue<T>) => {
			try {
				// Allow value to be a function so we have the same API as useState
				const valueToStore = value instanceof Function ? value(storedValue) : value;
				setStoredValue(valueToStore);
				
				// Save to local storage
				if (typeof window !== "undefined") {
					window.localStorage.setItem(key, JSON.stringify(valueToStore));
				}
			} catch (error) {
				console.warn(`Error setting localStorage key "${key}":`, error);
			}
		},
		[key, storedValue],
	);

	// Listen for changes to this localStorage key from other tabs/windows
	useEffect(() => {
		const handleStorageChange = (e: StorageEvent) => {
			if (e.key === key && e.newValue !== null) {
				try {
					setStoredValue(JSON.parse(e.newValue));
				} catch (error) {
					console.warn(`Error parsing localStorage key "${key}":`, error);
				}
			}
		};

		window.addEventListener("storage", handleStorageChange);
		return () => window.removeEventListener("storage", handleStorageChange);
	}, [key]);

	return [storedValue, setValue];
}
