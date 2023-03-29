import {useState, useCallback, useEffect} from "react";

const useLocalStorage = (key, initialValue = "") => {
    const [storedValue, setStoredValue] = useState(() => {
        let result = initialValue;
        let readVal = initialValue;

        if (typeof window === "undefined") {
            return result;
        }

        try {
            readVal = window.localStorage.getItem(key);
            result = JSON.parse(readVal);
        } catch (e) {
            console.warn(e);
            if (readVal) {
                result = readVal;
            }
        }

        return result;
    });

    const setValue = (value) => {
        setStoredValue(value);

        if (typeof window === "undefined") {
            return;
        }

        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.warn(e);
        }
    };

    const removeValue = () => {
        if (typeof window === "undefined") {
            return;
        }

        try {
            window.localStorage.removeItem(key);
        } catch (e) {
            console.warn(e);
        }
    };

    const onStorage = useCallback((storageEvent) => {
        if (storageEvent.key !== key) return;

        try {
            const item = storageEvent.newValue;
            if (item) {
                setStoredValue(JSON.parse(item));
            }
        } catch (e) {
            console.warn("could not update value for", key);
        }
    }, [key]);

    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        window.addEventListener("storage", onStorage);

        return () => {
            window.removeEventListener("storage", onStorage);
        };
    }, [onStorage]);

    return [storedValue, setValue, removeValue];
};

export default useLocalStorage;
