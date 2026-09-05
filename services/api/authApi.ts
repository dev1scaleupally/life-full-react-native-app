import { httpClient } from './httpClient';
import type {
  AppleLoginInput,
  AuthSession,
  GoogleLoginInput,
  RegisterInput,
  ResetPasswordResult,
  TokenPair,
  VerifyEmailResult,
} from './types';

export const authApi = {
  register: (input: RegisterInput) =>
    httpClient.post<AuthSession>('/auth/register', input).then(res => res.data),

  // There is no GET /auth/me — that route never existed on the real
  // backend (confirmed 2026-09-05). The equivalent is profileApi.get(),
  // GET /v1/profile, which is a different endpoint under a different
  // module for a reason: it's account/profile data, not an auth concern.

  login: (email: string, password: string) =>
    httpClient.post<AuthSession>('/auth/login', { email, password }).then(res => res.data),

  refresh: (refreshToken: string) =>
    httpClient.post<TokenPair>('/auth/refresh', { refreshToken }).then(res => res.data),

  verifyEmail: (token: string) =>
    httpClient.post<VerifyEmailResult>('/auth/verify-email', { token }).then(res => res.data),

  resendVerification: (email: string) =>
    httpClient.post<{ ok: true }>('/auth/resend-verification', { email }).then(res => res.data),

  /** Always resolves { ok: true } — the backend never reveals whether the
   * email matches an account, same pattern as resendVerification above. */
  forgotPassword: (email: string) =>
    httpClient.post<{ ok: true }>('/auth/forgot-password', { email }).then(res => res.data),

  /** Real path is /auth/update-password, not /auth/reset-password — and the
   * field is `newPassword`, not `password` (confirmed against the live
   * backend's OpenAPI spec + auth.service.ts, 2026-09-05). Also enforces
   * "new password must differ from the current one" as a 400. */
  resetPassword: (token: string, newPassword: string) =>
    httpClient.post<ResetPasswordResult>('/auth/update-password', { token, newPassword }).then(res => res.data),

  google: (input: GoogleLoginInput) =>
    httpClient.post<AuthSession>('/auth/google', input).then(res => res.data),

  apple: (input: AppleLoginInput) =>
    httpClient.post<AuthSession>('/auth/apple', input).then(res => res.data),
};
