export function getFromLocalStorage<T>(key: string, d: T): T {
    const item = localStorage.getItem(key);
    if (item) {
        try {
            return JSON.parse(item) as T;
        } catch (error) {
            console.error(`Błąd parsowania JSON dla klucza "${key}":`, error);
            return d;
        }
    }
    return d
}
export function localStorageKeyExists(key: string): boolean {
    return localStorage.getItem(key) !== null;
}