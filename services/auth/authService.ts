/**
 * MOCK auth backend. Persists "accounts" and one-shot verify/reset tokens in
 * AsyncStorage and fakes network latency, so every AuthStack flow —
 * validation, email verification, password reset, deep links — is fully
 * exercisable end to end without a real API.
 *
 * Replace every function body here with a real network call when the
 * backend exists; keep the signatures, since screens only ever import from
 * this module, never touch AsyncStorage directly.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AuthAccount, AuthResult } from './types';

const ACCOUNTS_KEY = 'lf_mock_accounts';
const VERIFY_TOKENS_KEY = 'lf_mock_verify_tokens';

const VERIFY_TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24h, per EmailVerify's expired-link state

type StoredAccount = AuthAccount & { password: string };
type TokenEntry = { email: string; issuedAt: number };

function delay(ms = 700): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function makeToken(): string {
  return `${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

async function readAccounts(): Promise<StoredAccount[]> {
  const raw = await AsyncStorage.getItem(ACCOUNTS_KEY);
  return raw ? JSON.parse(raw) : [];
}

async function writeAccounts(accounts: StoredAccount[]): Promise<void> {
  await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

async function readTokens(key: string): Promise<Record<string, TokenEntry>> {
  const raw = await AsyncStorage.getItem(key);
  return raw ? JSON.parse(raw) : {};
}

async function writeTokens(key: string, tokens: Record<string, TokenEntry>): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(tokens));
}

function toPublicAccount(account: StoredAccount): AuthAccount {
  const publicAccount = { ...account };
  delete (publicAccount as Partial<StoredAccount>).password;
  return publicAccount;
}

export async function signUpWithEmail(opts: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}): Promise<AuthResult> {
  await delay();
  const email = opts.email.trim().toLowerCase();
  const accounts = await readAccounts();
  if (accounts.some(a => a.email === email)) {
    return { ok: false, error: 'account_exists' };
  }
  const account: StoredAccount = {
    id: makeToken(),
    email,
    firstName: opts.firstName.trim(),
    lastName: opts.lastName.trim(),
    emailVerified: false,
    subscriptionStatus: 'never_subscribed',
    provider: 'email',
    password: opts.password,
  };
  await writeAccounts([...accounts, account]);
  await sendVerificationEmail(email);
  return { ok: true, account: toPublicAccount(account) };
}

export async function signInWithEmail(opts: {
  email: string;
  password: string;
}): Promise<AuthResult> {
  await delay();
  const email = opts.email.trim().toLowerCase();
  const accounts = await readAccounts();
  const account = accounts.find(a => a.email === email && a.password === opts.password);
  if (!account) return { ok: false, error: 'invalid_credentials' };
  return { ok: true, account: toPublicAccount(account) };
}

// upsertOAuthAccount (google/apple) used to live here too — AccountGateScreen
// now dispatches the real googleLoginRequested/appleLoginRequested actions
// for both providers (see store/auth/authSaga.ts), so this was removed
// rather than left as dead code once nothing imported it anymore.

/** (Re)sends the verification link. Used both on signup and on EmailVerify's resend. */
export async function sendVerificationEmail(email: string): Promise<void> {
  const tokens = await readTokens(VERIFY_TOKENS_KEY);
  const token = makeToken();
  tokens[token] = { email: email.trim().toLowerCase(), issuedAt: Date.now() };
  await writeTokens(VERIFY_TOKENS_KEY, tokens);
  const link = `lifefull://verify-email?token=${token}`;
  // TODO: wire a real transactional email provider. There is no email send
  // yet, so this log is the only place the link surfaces for local testing —
  // paste it into the simulator's Safari (or `xcrun simctl openurl booted`)
  // to exercise the deep-link flow.
  console.log('[mock email] verification link for', email, '->', link);
}

export type CompleteVerificationResult = { email: string; expired: boolean } | null;

/** Called from the deep-link handler when a verify link is opened. */
export async function completeEmailVerification(token: string): Promise<CompleteVerificationResult> {
  const tokens = await readTokens(VERIFY_TOKENS_KEY);
  const entry = tokens[token];
  if (!entry) return null;
  const expired = Date.now() - entry.issuedAt > VERIFY_TOKEN_TTL_MS;
  if (!expired) {
    const accounts = await readAccounts();
    const idx = accounts.findIndex(a => a.email === entry.email);
    if (idx >= 0) {
      accounts[idx] = { ...accounts[idx], emailVerified: true };
      await writeAccounts(accounts);
    }
    delete tokens[token];
    await writeTokens(VERIFY_TOKENS_KEY, tokens);
  }
  return { email: entry.email, expired };
}

// Password reset (requestPasswordReset/validateResetToken/completePasswordReset)
// used to live here too, but that flow now calls the real
// POST /auth/forgot-password and POST /auth/reset-password (see
// services/api/authApi.ts, store/auth/authSaga.ts) — removed rather than
// left as dead code once nothing imported them anymore.
