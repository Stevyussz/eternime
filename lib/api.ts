export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/otakudesu";

export async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`;

    try {
        const res = await fetch(url, {
            ...options,
            cache: options?.cache || 'no-store', // Default to no-store for dynamic content
        });

        if (!res.ok) {
            console.error(`API Error ${res.status} at ${url}`);
            throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
        }

        return await res.json() as T;
    } catch (error) {
        console.error("Fetch API Error:", error);
        throw error;
    }
}
