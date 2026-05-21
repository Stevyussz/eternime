/**
 * API client — root URL tanpa provider suffix.
 * Gunakan smartFetch() untuk auto-cascade, atau fetchFromProvider() untuk endpoint spesifik.
 */
export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001").replace(/\/$/, "");

/**
 * Generic fetch helper — tetap tersedia untuk backward compatibility.
 * Untuk fitur baru, preferkan smartFetch() atau fetchFromProvider() dari lib/smartFetch.ts.
 */
export async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`;

  const res = await fetch(url, {
    ...options,
    next: options?.cache ? undefined : { revalidate: 600 }, // ISR 10 menit default
    ...( options?.cache ? { cache: options.cache } : {} ),
  });

  if (!res.ok) {
    console.error(`API Error ${res.status} at ${url}`);
    throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}
