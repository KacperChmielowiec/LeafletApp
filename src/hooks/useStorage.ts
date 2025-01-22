import { useCallback, useState, useEffect, Dispatch, SetStateAction } from "react";

type StorageType = typeof window.localStorage | typeof window.sessionStorage;

type UseStorageReturn<T> = [T, Dispatch<SetStateAction<T>>, () => void];

export function useLocalStorage<T>(key: string, defaultValue: T): UseStorageReturn<T> {
    return useStorage<T>(key, defaultValue, window.localStorage);
}

export function useSessionStorage<T>(key: string, defaultValue: T): UseStorageReturn<T> {
    return useStorage<T>(key, defaultValue, window.sessionStorage);
}

function useStorage<T>(key: string, defaultValue: T, storageObject: StorageType): UseStorageReturn<T> {
    const [value, setValue] = useState<T>(() => {
        const jsonValue = storageObject.getItem(key);
        if (jsonValue != null) return JSON.parse(jsonValue) as T;

        if (typeof defaultValue === "function") {
            return (defaultValue as () => T)();
        } else {
            return defaultValue;
        }
    });

    useEffect(() => {
        if (value === undefined) {
            storageObject.removeItem(key);
        } else {
            storageObject.setItem(key, JSON.stringify(value));
        }
    }, [key, value, storageObject]);

    const remove = useCallback(() => {
        setValue(undefined as unknown as T); 
    }, []);

    return [value, setValue, remove ];
}
