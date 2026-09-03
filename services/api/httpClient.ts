import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '../../config/apiConfig';
import { tokenStore } from './tokenStore';
import { ApiError, type ApiErrorBody, type TokenPair } from './types';

/**
 * Every Public route — a 401 from one of these is a real "wrong
 * credentials" / "bad token" answer, never a stale-access-token situation,
 * so the refresh-and-retry logic below must never fire for them.
 */
const PUBLIC_PATHS = [
  '/auth/register',
  '/auth/login',
  '/auth/refresh',
  '/auth/verify-email',
  '/auth/resend-verification',
  '/auth/google',
  '/auth/apple',
  '/onboarding/catalog',
  '/onboarding/score',
];

export const httpClient = axios.create({
  baseURL: `${API_BASE_URL}/v1`,
  timeout: 20000,
});

/** Never print a password to the console, even in debug logs. */
function redact(data: unknown): unknown {
  if (!data || typeof data !== 'object') return data;
  const clone: Record<string, unknown> = { ...(data as Record<string, unknown>) };
  if ('password' in clone) clone.password = '••••••••';
  return clone;
}

httpClient.interceptors.request.use(config => {
  const session = tokenStore.get();
  if (session?.accessToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  console.log(`[api] → ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, redact(config.data));
  return config;
});

// Concurrent requests that all 401 at once must trigger exactly one
// POST /auth/refresh, not one per request — this serializes them.
let refreshPromise: Promise<TokenPair> | null = null;

async function refreshSession(): Promise<TokenPair> {
  const session = tokenStore.get();
  if (!session?.refreshToken) {
    throw new Error('No refresh token available');
  }
  // Plain axios, not httpClient — this must never itself go back through
  // the response interceptor below and loop.
  const { data } = await axios.post<TokenPair>(`${API_BASE_URL}/v1/auth/refresh`, {
    refreshToken: session.refreshToken,
  });
  await tokenStore.set(data);
  return data;
}

let onSessionExpired: (() => void) | null = null;
/** Wired up once from store/index.ts so a failed refresh can log the user out in redux. */
export function setOnSessionExpired(callback: () => void) {
  onSessionExpired = callback;
}

httpClient.interceptors.response.use(
  response => {
    console.log(`[api] ← ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    return response;
  },
  async (error: AxiosError<ApiErrorBody>) => {
    const original = error.config as (AxiosRequestConfig & { _retried?: boolean }) | undefined;
    const isPublicRoute = PUBLIC_PATHS.some(path => original?.url?.startsWith(path));

    console.log(
      `[api] ← ${error.response?.status ?? '(no response)'} ${original?.method?.toUpperCase()} ${original?.url}`,
      error.response?.data ?? error.message,
    );

    if (error.response?.status === 401 && original && !original._retried && !isPublicRoute) {
      original._retried = true;
      try {
        refreshPromise = refreshPromise ?? refreshSession();
        const session = await refreshPromise;
        refreshPromise = null;
        original.headers = { ...original.headers, Authorization: `Bearer ${session.accessToken}` };
        return httpClient(original);
      } catch (refreshError) {
        refreshPromise = null;
        await tokenStore.clear();
        onSessionExpired?.();
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.data) {
      return Promise.reject(new ApiError(error.response.data));
    }
    return Promise.reject(error);
  },
);
