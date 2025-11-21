type CacheEntry<T> = { value: T; expiresAt: number };

const globalAny = global as unknown as { __ttlCache?: Map<string, CacheEntry<any>> };
if (!globalAny.__ttlCache) globalAny.__ttlCache = new Map();
const store = globalAny.__ttlCache!;

export function getCache<T = unknown>(key: string): T | null {
  const now = Date.now();
  const hit = store.get(key);
  if (!hit) return null;
  if (hit.expiresAt < now) {
    store.delete(key);
    return null;
  }
  return hit.value as T;
}

export function setCache<T = unknown>(key: string, value: T, ttlSeconds: number) {
  const expiresAt = Date.now() + ttlSeconds * 1000;
  store.set(key, { value, expiresAt });
}

export function delCache(key: string) {
  store.delete(key);
}
