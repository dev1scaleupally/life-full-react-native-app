/**
 * Parses and routes the two auth deep links, in either of two forms:
 *   lifefull://verify-email?token=...                (custom scheme — always
 *   lifefull://reset-password?token=...                works, no domain
 *                                                       needed; what local
 *                                                       dev/testing should
 *                                                       keep using)
 *   https://<APP_LINK_HOST>/verify?token=...          (App Link — only opens
 *   https://<APP_LINK_HOST>/reset-password?token=...   the app directly once
 *                                                       APP_LINK_HOST is
 *                                                       verified; see
 *                                                       deepLinkConfig.ts)
 * The App Link paths are deliberately bare root paths (no /v1/auth/ prefix)
 * — confirmed against the backend's actual mailer.service.ts + main.ts
 * (2026-09-05): both are excluded from the API's own /v1 prefix specifically
 * so the app can claim them as App Link paths, matching what the backend
 * literally emails. /verify has a real browser-facing GET page behind it
 * (VerifyController) so that one double-duties as a working fallback when
 * App Links aren't verified; /reset-password does NOT yet (no equivalent
 * controller exists server-side — mailer.service.ts's own comment says the
 * app "eventually claims" that path, implying the page isn't built yet), so
 * for now that link 404s in a plain browser and only works via the app.
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
  `^https://${APP_LINK_HOST.replace(/\./g, '\\.')}/([a-z-]+)\\??(.*)$`,
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
  // 'verify-email' is the custom scheme's host name; 'verify' is the App
  // Link's bare route (matches VerifyController's real @Controller('verify'))
  // — both mean the same thing. 'reset-password' is identical in both forms.
  if (path === 'verify-email' || path === 'verify') return { type: 'verify', token };
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
  // actual POST /auth/update-password submit reveal an expired/invalid token,
  // same as EmailVerifyScreen does for its own deep link.
  navigationRef.navigate('NewPassword', { token: parsed.token });
}
