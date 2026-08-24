import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../constants/storage';
import type { TokenPair } from './types';

/**
 * Single source of truth for the current access/refresh tokens. Kept as a
 * plain in-memory module (not redux) so httpClient.ts can read/write it
 * synchronously from an axios interceptor without importing the store and
 * risking a circular dependency (store -> sagas -> httpClient -> store).
 *
 * store/auth mirrors this into redux state for UI purposes; this module
 * stays the thing that's actually authoritative and persisted.
 */
type Listener = (session: TokenPair | null) => void;

let current: TokenPair | null = null;
const listeners = new Set<Listener>();

async function persist(session: TokenPair | null) {
  if (session) {
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.accessToken, session.accessToken),
      AsyncStorage.setItem(STORAGE_KEYS.refreshToken, session.refreshToken),
      AsyncStorage.setItem(STORAGE_KEYS.userId, session.userId),
    ]);
  } else {
    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEYS.accessToken),
      AsyncStorage.removeItem(STORAGE_KEYS.refreshToken),
      AsyncStorage.removeItem(STORAGE_KEYS.userId),
    ]);
  }
}

export const tokenStore = {
  /** Synchronous — safe to call from the axios interceptor. */
  get(): TokenPair | null {
    return current;
  },

  /** Reads any session persisted from a previous app launch into memory. Call once, before anything else touches the store. */
  async hydrate(): Promise<TokenPair | null> {
    const [accessToken, refreshToken, userId] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEYS.accessToken),
      AsyncStorage.getItem(STORAGE_KEYS.refreshToken),
      AsyncStorage.getItem(STORAGE_KEYS.userId),
    ]);
    current = accessToken && refreshToken && userId ? { accessToken, refreshToken, userId } : null;
    return current;
  },

  async set(session: TokenPair): Promise<void> {
    current = session;
    await persist(session);
    listeners.forEach(listener => listener(current));
  },

  async clear(): Promise<void> {
    current = null;
    await persist(null);
    listeners.forEach(listener => listener(current));
  },

  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
