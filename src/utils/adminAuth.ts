// Helper utility for managing Admin authentication tokens and API requests

const TOKEN_KEY = 'dxn_admin_token';
const USER_KEY = 'dxn_admin_user';

export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function getStoredAdminUser(): any | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setStoredAdminUser(user: any): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAdminAuth(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getAdminAuthHeaders(customHeaders: Record<string, string> = {}): Record<string, string> {
  const token = getAdminToken();
  const headers: Record<string, string> = { ...customHeaders };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function safeJson<T = any>(res: Response): Promise<{ ok: boolean; data: T | null; error?: string }> {
  try {
    const text = await res.text();
    if (!text || text.trim() === '') {
      return { ok: res.ok, data: null };
    }
    const trimmed = text.trim();
    if (trimmed.startsWith('<') || trimmed.startsWith('A server error') || trimmed.startsWith('Internal Server Error')) {
      return {
        ok: false,
        data: null,
        error: `Server returned an error (${res.status}). Please check network or reload.`
      };
    }
    const parsed = JSON.parse(text);
    return {
      ok: res.ok,
      data: parsed,
      error: parsed?.error || (!res.ok ? `Request failed (${res.status})` : undefined)
    };
  } catch {
    return {
      ok: false,
      data: null,
      error: !res.ok ? `Server error (${res.status}).` : 'Invalid response from server.'
    };
  }
}

export async function adminFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const existingHeaders = (options.headers as Record<string, string>) || {};
  const token = getAdminToken();
  
  const headers: Record<string, string> = {
    ...existingHeaders
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(url, {
    ...options,
    headers,
    credentials: 'include'
  });
}
