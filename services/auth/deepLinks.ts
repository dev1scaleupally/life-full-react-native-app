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
import { completeEmailVerification, validateResetToken } from './authService';

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
    const result = await completeEmailVerification(parsed.token);
    if (!result) return; // unknown or already-used token — nothing to do
    if (result.expired) {
      navigationRef.navigate('EmailVerify', { email: result.email, expired: true });
    } else {
      // Deliberately no separate "verified!" screen — straight to sign-in.
      navigationRef.navigate('EmailForm', {
        mode: 'signin',
        email: result.email,
        verifiedBanner: true,
      });
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
