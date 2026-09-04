/**
 * Parses and routes the two auth deep links, in either of two forms:
 *   lifefull://verify-email?token=...                      (custom scheme —
 *   lifefull://reset-password?token=...                      always works, no
 *                                                             domain needed;
 *                                                             what local
 *                                                             dev/testing
 *                                                             should keep
 *                                                             using)
 *   https://<APP_LINK_HOST>/v1/auth/verify-email?token=...  (App Link —
 *   https://<APP_LINK_HOST>/v1/auth/reset-password?token=... only opens the
 *                                                             app directly
 *                                                             once
 *                                                             APP_LINK_HOST
 *                                                             is verified;
 *                                                             see
 *                                                             deepLinkConfig.ts)
 * The App Link path deliberately mirrors the backend's own route
 * (mailer.service.ts builds exactly this URL for the real email) rather than
 * a shorter made-up one — so the same link both opens the app on Android
 * once verified, AND still renders a working page if it falls through to a
 * browser instead (GET /v1/auth/verify-email already exists server-side).
 *
 * Both forms are accepted indefinitely, not just during a migration window —
 * the custom scheme is a legitimate fallback (e.g. a desktop mail client
 * that can't verify App Links) even once App Links are verified.
 *
 * Deliberately hand-rolled instead of relying on the global `URL`/
 * `URLSearchParams` — not guaranteed present on every RN version — since the
 * shape here (one query param) is trivial to parse directly.
 */
import { APP_LINK_HOST } from '../../config/deepLinkConfig';
import { navigationRef } from '../../navigation/navigationRef';
import { authApi } from '../api/authApi';
import { ApiError } from '../api/types';
import { store } from '../../store';
import { authActions } from '../../store/auth/authSlice';

export type ParsedAuthLink = { type: 'verify' | 'reset'; token: string } | null;

const CUSTOM_SCHEME_PATTERN = /^lifefull:\/\/([a-z-]+)\??(.*)$/i;
const APP_LINK_PATTERN = new RegExp(
  `^https://${APP_LINK_HOST.replace(/\./g, '\\.')}/v1/auth/([a-z-]+)\\??(.*)$`,
  'i',
);

function readTokenParam(query: string): string | null {
  for (const pair of query.split('&')) {
    if (!pair) continue;
    const [key, value] = pair.split('=');
    if (key === 'token' && value) return decodeURIComponent(value);
  }
  return null;
}

export function parseAuthDeepLink(url: string): ParsedAuthLink {
  const match = url.match(CUSTOM_SCHEME_PATTERN) ?? url.match(APP_LINK_PATTERN);
  if (!match) return null;
  const [, path, query] = match;
  const token = readTokenParam(query ?? '');
  if (!token) return null;
  // Same final path segment either way — 'verify-email'/'reset-password' —
  // whether it came from the custom scheme's host or the App Link's route.
  if (path === 'verify-email') return { type: 'verify', token };
  if (path === 'reset-password') return { type: 'reset', token };
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

  // No pre-validation step (the backend has no "check without consuming"
  // route, same as verify-email) — go straight to the form and let the
  // actual POST /auth/reset-password submit reveal an expired/invalid token,
  // same as EmailVerifyScreen does for its own deep link.
  navigationRef.navigate('NewPassword', { token: parsed.token });
}
