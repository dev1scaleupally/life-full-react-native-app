/**
 * Client-side field validation shared by the AuthStack screens. Deliberately
 * separate from services/auth/authService.ts — that layer reports
 * account-level conditions (e.g. "an account already exists"); this one
 * checks a single field's shape before a request is ever made.
 */

// Basic shape check, not RFC 5322 — good enough to catch typos without
// rejecting real addresses.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

// Must match the backend's /auth/register minimum exactly, or a password
// that passes here just bounces back as a 400 from the server instead.
export const MIN_PASSWORD_LENGTH = 10;

export function isValidPassword(value: string): boolean {
  return value.length >= MIN_PASSWORD_LENGTH;
}
