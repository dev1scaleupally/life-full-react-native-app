/**
 * Parses and routes the two auth deep links:
 *   lifefull://verify-email?token=...
 *   lifefull://reset-password?token=...
 *
 * Deliberately hand-rolled instead of relying on the global `URL`/
 * `URLSearchParams` — not guaranteed present on every RN version — since the
 * shape here (custom scheme, one query param) is trivial to parse directly.
 */
import { navigationRef } from '../../navigation/navigationRef';
import { authApi } from '../api/authApi';
import { ApiError } from '../api/types';
import { store } from '../../store';
import { authActions } from '../../store/auth/authSlice';
import { validateResetToken } from './authService';

export type ParsedAuthLink = { type: 'verify' | 'reset'; token: string } | null;

function readTokenParam(query: string): string | null {
  for (const pair of query.split('&')) {
    if (!pair) continue;
    const [key, value] = pair.split('=');
    if (key === 'token' && value) return decodeURIComponent(value);
  }
  return null;
}

export function parseAuthDeepLink(url: string): ParsedAuthLink {
  const match = url.match(/^lifefull:\/\/([a-z-]+)\??(.*)$/i);
  if (!match) return null;
  const [, host, query] = match;
  const token = readTokenParam(query ?? '');
  if (!token) return null;
  if (host === 'verify-email') return { type: 'verify', token };
  if (host === 'reset-password') return { type: 'reset', token };
  return null;
}

export async function handleAuthDeepLink(url: string): Promise<void> {
  const parsed = parseAuthDeepLink(url);
  if (!parsed || !navigationRef.isReady()) return;

  if (parsed.type === 'verify') {
    try {
      const result = await authApi.verifyEmail(parsed.token);
      store.dispatch(authActions.verifyEmailSucceeded());
      // Deliberately no separate "verified!" screen — straight to sign-in.
      navigationRef.navigate('EmailForm', {
        mode: 'signin',
        email: result.email,
        verifiedBanner: true,
      });
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Something went wrong. Please try again.';
      console.error('[deepLinks] verify-email API error:', message);
      store.dispatch(authActions.verifyEmailFailed({ message }));
      // 410 = expired, and the backend echoes back the address it belonged to
      // (the link itself carries only a token). Anything else — invalid or
      // already-consumed token, network error — there's nowhere useful to
      // route, so it's a silent no-op, same as the mock's "unknown token" case.
      if (err instanceof ApiError && err.statusCode === 410 && err.email) {
        navigationRef.navigate('EmailVerify', { email: err.email, expired: true });
      }
    }
    return;
  }

  const result = await validateResetToken(parsed.token);
  if (!result) return;
  if (result.expired) {
    navigationRef.navigate('ForgotPassword', { email: result.email, expiredError: true });
  } else {
    navigationRef.navigate('NewPassword', { email: result.email, token: parsed.token });
  }
}
