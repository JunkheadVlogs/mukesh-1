/**
 * Safe wrapper for localStorage and sessionStorage to prevent SecurityErrors/DOMExceptions
 * in cross-origin frames or private browser sessions where simple storage access is blocked.
 */

class SafeStorage implements Storage {
  private inMemory: Record<string, string> = {};
  private storageType: 'localStorage' | 'sessionStorage';

  constructor(type: 'localStorage' | 'sessionStorage') {
    this.storageType = type;
  }

  private get store(): Storage | null {
    try {
      if (typeof window === 'undefined') return null;
      const storage = window[this.storageType];
      if (!storage) return null;
      
      // Verification check to confirm it's actually read/write block-free
      const testKey = '__safestorage_test__';
      storage.setItem(testKey, '1');
      storage.removeItem(testKey);
      return storage;
    } catch (e) {
      return null;
    }
  }

  get length(): number {
    try {
      const storage = this.store;
      if (storage) return storage.length;
    } catch (e) {
      // fallback
    }
    return Object.keys(this.inMemory).length;
  }

  clear(): void {
    try {
      const storage = this.store;
      if (storage) {
        storage.clear();
        return;
      }
    } catch (e) {
      console.warn(`[SafeStorage] clear failed for ${this.storageType}:`, e);
    }
    this.inMemory = {};
  }

  getItem(key: string): string | null {
    try {
      const storage = this.store;
      if (storage) return storage.getItem(key);
    } catch (e) {
      console.warn(`[SafeStorage] getItem failed for ${this.storageType} key: ${key}:`, e);
    }
    return Object.prototype.hasOwnProperty.call(this.inMemory, key) ? this.inMemory[key] : null;
  }

  key(index: number): string | null {
    try {
      const storage = this.store;
      if (storage) return storage.key(index);
    } catch (e) {
      // fallback
    }
    const keys = Object.keys(this.inMemory);
    return index >= 0 && index < keys.length ? keys[index] : null;
  }

  removeItem(key: string): void {
    try {
      const storage = this.store;
      if (storage) {
        storage.removeItem(key);
        return;
      }
    } catch (e) {
      console.warn(`[SafeStorage] removeItem failed for ${this.storageType} key: ${key}:`, e);
    }
    delete this.inMemory[key];
  }

  setItem(key: string, value: string): void {
    try {
      const storage = this.store;
      if (storage) {
        storage.setItem(key, value);
        return;
      }
    } catch (e) {
      console.warn(`[SafeStorage] setItem failed for ${this.storageType} key: ${key}:`, e);
    }
    this.inMemory[key] = String(value);
  }
}

export const safeLocalStorage = new SafeStorage('localStorage');
export const safeSessionStorage = new SafeStorage('sessionStorage');
