import { httpClient } from './httpClient';
import type {
  AppleLoginInput,
  AuthSession,
  GoogleLoginInput,
  MeResponse,
  RegisterInput,
  ResetPasswordResult,
  TokenPair,
  VerifyEmailResult,
} from './types';

export const authApi = {
  register: (input: RegisterInput) =>
    httpClient.post<AuthSession>('/auth/register', input).then(res => res.data),

  /** The account's name/email plus its full BasicProfile — see App.tsx's
   * loadProfileFromServer, the only caller (a returning sign-in has no
   * other way to learn the signed-in account's name or "About You"). */
  me: () => httpClient.get<MeResponse>('/auth/me').then(res => res.data),

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

  resetPassword: (token: string, password: string) =>
    httpClient.post<ResetPasswordResult>('/auth/reset-password', { token, password }).then(res => res.data),

  google: (input: GoogleLoginInput) =>
    httpClient.post<AuthSession>('/auth/google', input).then(res => res.data),

  apple: (input: AppleLoginInput) =>
    httpClient.post<AuthSession>('/auth/apple', input).then(res => res.data),
};
