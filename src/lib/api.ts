// In dev: use Vite proxy (relative URL). In prod: VITE_API_URL env or hardcoded fallback.
const API_BASE =
    (import.meta as any).env?.VITE_API_URL ||
    (typeof window !== "undefined" && window.location.hostname !== "localhost"
        ? "https://backend-production-c97f.up.railway.app"
        : "");

interface FetchOptions extends RequestInit {
    token?: string;
}

/**
 * Typed fetch wrapper for the Digital FTE API.
 */
export async function api<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { token, headers: customHeaders, ...fetchOptions } = options;

    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...customHeaders,
    };

    const response = await fetch(`${API_BASE}/api${endpoint}`, {
        ...fetchOptions,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: "Unknown error" }));
        throw new Error(error.detail || `API Error ${response.status}`);
    }

    return response.json() as Promise<T>;
}
