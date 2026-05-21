/**
 * smartFetch — Auto-Provider Cascade System
 *
 * Mencoba provider berurutan (Kuramanime → Otakudesu → AnimeSail → Samehadaku).
 * Jika satu gagal (network error / 4xx / 5xx), langsung lanjut ke berikutnya.
 * Mengembalikan data + nama provider yang berhasil.
 */
import { PROVIDER_ORDER, type ProviderName } from "./providerConfig";

const API_ROOT = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// ISR revalidation — 10 menit (600 detik) untuk data semi-statis
const DEFAULT_REVALIDATE = 600;

interface SmartFetchOptions {
  /** Seconds for ISR revalidation. 0 = no-store */
  revalidate?: number;
  /** Start from specific provider (skip earlier ones) */
  startFrom?: ProviderName;
  /** Override provider order */
  providerOrder?: ProviderName[];
}

interface SmartFetchResult<T> {
  data: T;
  activeProvider: ProviderName;
  fallbackOccurred: boolean;
  error?: undefined;
}

interface SmartFetchError {
  data?: undefined;
  activeProvider?: undefined;
  fallbackOccurred?: undefined;
  error: string;
}

export type SmartFetchResponse<T> = SmartFetchResult<T> | SmartFetchError;

/**
 * Fetch dengan auto-cascade provider.
 *
 * @param buildUrl   Function(providerName) → endpoint path (relative to API root)
 * @param normalize  Function(rawResponse, providerName) → T
 * @param opts       Options (revalidate, startFrom, providerOrder)
 */
export async function smartFetch<T>(
  buildUrl: (provider: ProviderName) => string,
  normalize: (raw: unknown, provider: ProviderName) => T,
  opts: SmartFetchOptions = {}
): Promise<SmartFetchResult<T>> {
  const {
    revalidate = DEFAULT_REVALIDATE,
    startFrom,
    providerOrder = PROVIDER_ORDER,
  } = opts;

  const order = startFrom
    ? providerOrder.slice(providerOrder.indexOf(startFrom))
    : providerOrder;

  const errors: string[] = [];

  for (let i = 0; i < order.length; i++) {
    const provider = order[i];
    const endpoint = buildUrl(provider);
    const url = endpoint.startsWith("http") ? endpoint : `${API_ROOT}${endpoint}`;

    try {
      const fetchOpts: RequestInit = revalidate === 0
        ? { cache: "no-store" }
        : { next: { revalidate } };

      const res = await fetch(url, fetchOpts);

      if (!res.ok) {
        errors.push(`[${provider}] HTTP ${res.status}`);
        console.warn(`[smartFetch] ${provider} failed (${res.status}): ${url}`);
        continue;
      }

      const raw = await res.json();
      const data = normalize(raw, provider);

      if (i > 0) {
        console.info(`[smartFetch] ⚡ Cascaded to ${provider} after ${errors.join(", ")}`);
      }

      return { data, activeProvider: provider, fallbackOccurred: i > 0 };

    } catch (err: any) {
      errors.push(`[${provider}] ${err?.message || "Network error"}`);
      console.warn(`[smartFetch] ${provider} error:`, err?.message);
    }
  }

  // All providers failed — throw structured error
  throw new Error(`All providers failed: ${errors.join(" | ")}`);
}

/**
 * Simple single-provider fetch (non-cascading).
 * Digunakan untuk endpoint spesifik yang provider-locked (detail page, episode).
 */
export async function fetchFromProvider<T = unknown>(
  endpoint: string,
  opts: { revalidate?: number } = {}
): Promise<T> {
  const { revalidate = DEFAULT_REVALIDATE } = opts;
  const url = endpoint.startsWith("http") ? endpoint : `${API_ROOT}${endpoint}`;

  const fetchOpts: RequestInit = revalidate === 0
    ? { cache: "no-store" }
    : { next: { revalidate } };

  const res = await fetch(url, fetchOpts);

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${url}`);
  }

  return res.json() as Promise<T>;
}
