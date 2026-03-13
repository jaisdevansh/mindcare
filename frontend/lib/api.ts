
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const apiFetch = async (endpoint: string, options: RequestInit = {}, timeoutMs = 90000) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);

    // Don't force Content-Type for FormData — let the browser set it with boundary
    const isFormData = options.body instanceof FormData;
    const headers: Record<string, string> = {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        'Cache-Control': 'no-store',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...(options.headers as Record<string, string> || {}),
    };

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
            cache: 'no-store',
            signal: controller.signal,
        });
        clearTimeout(id);

        // Always parse body — even on 4xx/5xx so callers get res.success=false + message
        let data: any;
        try {
            data = await response.json();
        } catch {
            data = { success: false, message: `HTTP ${response.status}` };
        }

        return data;
    } catch (error: any) {
        clearTimeout(id);
        if (error.name === 'AbortError') {
            throw new Error('Request timed out. Please check if the backend is running.');
        }
        throw error;
    }
};
