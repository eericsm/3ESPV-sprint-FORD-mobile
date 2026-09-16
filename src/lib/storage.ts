import AsyncStorage from '@react-native-async-storage/async-storage';

export async function loadJson<T>(key: string, fallback: T): Promise<T> {
    try {
        const value = await AsyncStorage.getItem(key);
        return value ? (JSON.parse(value) as T) : fallback;
    } catch {
        return fallback;
    }
}

export async function saveJson<T>(key: string, value: T): Promise<void> {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch {
        // Ignore storage failures and keep the current in-memory state.
    }
}

export async function removeValue(key: string): Promise<void> {
    try {
        await AsyncStorage.removeItem(key);
    } catch {
        // Ignore storage failures.
    }
}
