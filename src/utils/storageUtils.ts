export const getStorageItem = <T>(key: string, defaultValue?: T): T | null => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue ?? null;
    try {
      return JSON.parse(item) as T;
    } catch {
      return item as unknown as T;
    }
  } catch {
    return defaultValue ?? null;
  }
};

export const setStorageItem = (key: string, value: any): boolean => {
  try {
    // JSON-encode always, so reads via JSON.parse round-trip correctly.
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

export const removeStorageItem = (key: string): boolean => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
};

export const clearStorage = (): boolean => {
  try {
    localStorage.clear();
    return true;
  } catch {
    return false;
  }
};

export const hasStorageItem = (key: string): boolean => {
  return localStorage.getItem(key) !== null;
};
