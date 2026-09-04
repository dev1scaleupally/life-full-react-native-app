/**
 * Client-side field validation shared by the AuthStack screens. Deliberately
 * separate from services/auth/authService.ts — that layer reports
 * account-level conditions (e.g. "an account already exists"); this one
 * checks a single field's shape before a request is ever made.
 */

// Basic shape check, not RFC 5322 — good enough to catch typos without
// rejecting real addresses. TLD is required to be 2+ letters so this stays
// aligned with the backend's zod .email() (packages/contracts/src/api.ts in
// lifefull-app-backend), which rejects single-character and numeric TLDs —
// otherwise a value that passes here could still bounce back as a 400.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

// Must match the backend's /auth/register minimum exactly, or a password
// that passes here just bounces back as a 400 from the server instead.
// Requirement (2026-09-04): 8, not 10 — backend's RegisterDto
// (packages/contracts/src/api.ts in lifefull-app-backend) needs the matching
// `z.string().min(10)` -> `.min(8)` change; this frontend value must not
// ship ahead of that backend change landing, or valid 8-9 char passwords
// will fail at the server. See auth-password-min-length memory.
export const MIN_PASSWORD_LENGTH = 8;

export function isValidPassword(value: string): boolean {
  return value.length >= MIN_PASSWORD_LENGTH;
}
