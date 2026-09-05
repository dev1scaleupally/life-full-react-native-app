import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AppleLoginInput, GoogleLoginInput, RegisterInput } from '../../services/api/types';

export type AuthState = {
  userId: string | null;
  isAuthenticated: boolean;
  /** Known only right after register/login/google/apple — a bootstrap
   * (refresh) doesn't re-report it, so this goes back to null until the
   * next fresh sign-in, or a GET /me is added if the UI needs it at launch. */
  emailVerified: boolean | null;
  status: 'idle' | 'loading' | 'error';
  error: string | null;
  /** False until the app-launch session check (see authSaga's handleRefresh)
   * has run once — gate navigation on this, not just isAuthenticated, so
   * the app doesn't flash a logged-out screen while that check is in flight. */
  bootstrapped: boolean;

  verifyEmailStatus: 'idle' | 'loading' | 'success' | 'error';
  verifyEmailError: string | null;

  resendVerificationStatus: 'idle' | 'loading' | 'success' | 'error';
  resendVerificationError: string | null;

  forgotPasswordStatus: 'idle' | 'loading' | 'success' | 'error';
  forgotPasswordError: string | null;

  resetPasswordStatus: 'idle' | 'loading' | 'success' | 'error';
  // Unlike verify-email, POST /auth/update-password never echoes the email
  // back — not on success, not on its 410 expired case (confirmed against
  // auth.service.ts) — so there's no address to carry forward here. Any
  // "which email got reset" UX (prefilling sign-in, routing an expired link
  // back to ForgotPassword with the address filled in) simply isn't
  // possible against this endpoint; resetPasswordError covers every failure
  // case (invalid link, expired link, same-password-as-before) with the
  // backend's own message.
  resetPasswordError: string | null;
};

const initialState: AuthState = {
  userId: null,
  isAuthenticated: false,
  emailVerified: null,
  status: 'idle',
  error: null,
  bootstrapped: false,
  verifyEmailStatus: 'idle',
  verifyEmailError: null,
  resendVerificationStatus: 'idle',
  resendVerificationError: null,
  forgotPasswordStatus: 'idle',
  forgotPasswordError: null,
  resetPasswordStatus: 'idle',
  resetPasswordError: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    registerRequested: (state, _action: PayloadAction<RegisterInput>) => {
      state.status = 'loading';
      state.error = null;
    },
    loginRequested: (state, _action: PayloadAction<{ email: string; password: string }>) => {
      state.status = 'loading';
      state.error = null;
    },
    googleLoginRequested: (state, _action: PayloadAction<GoogleLoginInput>) => {
      state.status = 'loading';
      state.error = null;
    },
    appleLoginRequested: (state, _action: PayloadAction<AppleLoginInput>) => {
      state.status = 'loading';
      state.error = null;
    },
    /** Dispatched once at app launch by rootSaga; also safe to dispatch
     * manually to force-rotate the current refresh token. */
    refreshRequested: state => {
      state.status = 'loading';
    },
    authSucceeded: (state, action: PayloadAction<{ userId: string; emailVerified: boolean }>) => {
      state.status = 'idle';
      state.error = null;
      state.isAuthenticated = true;
      state.userId = action.payload.userId;
      state.emailVerified = action.payload.emailVerified;
      state.bootstrapped = true;
    },
    authFailed: (state, action: PayloadAction<{ message: string }>) => {
      state.status = 'error';
      state.error = action.payload.message;
      state.bootstrapped = true;
    },
    /** Outcome of the app-launch bootstrap check specifically — payload is
     * null when there was no stored session, or it turned out to be invalid. */
    bootstrapCompleted: (state, action: PayloadAction<{ userId: string } | null>) => {
      state.status = 'idle';
      state.bootstrapped = true;
      if (action.payload) {
        state.isAuthenticated = true;
        state.userId = action.payload.userId;
      }
    },
    loggedOut: state => {
      state.userId = null;
      state.isAuthenticated = false;
      state.emailVerified = null;
      state.status = 'idle';
      state.error = null;
      state.bootstrapped = true;
    },
    /** httpClient calls this (via store/index.ts's setOnSessionExpired wiring)
     * when a 401 survives a refresh attempt. */
    sessionExpired: state => {
      state.userId = null;
      state.isAuthenticated = false;
      state.emailVerified = null;
      state.status = 'idle';
      state.error = 'Your session expired — please sign in again.';
      state.bootstrapped = true;
    },

    verifyEmailRequested: (state, _action: PayloadAction<{ token: string }>) => {
      state.verifyEmailStatus = 'loading';
      state.verifyEmailError = null;
    },
    verifyEmailSucceeded: state => {
      state.verifyEmailStatus = 'success';
      state.emailVerified = true;
    },
    verifyEmailFailed: (state, action: PayloadAction<{ message: string }>) => {
      state.verifyEmailStatus = 'error';
      state.verifyEmailError = action.payload.message;
    },

    resendVerificationRequested: (state, _action: PayloadAction<{ email: string }>) => {
      state.resendVerificationStatus = 'loading';
      state.resendVerificationError = null;
    },
    resendVerificationSucceeded: state => {
      state.resendVerificationStatus = 'success';
    },
    resendVerificationFailed: (state, action: PayloadAction<{ message: string }>) => {
      state.resendVerificationStatus = 'error';
      state.resendVerificationError = action.payload.message;
    },

    forgotPasswordRequested: (state, _action: PayloadAction<{ email: string }>) => {
      state.forgotPasswordStatus = 'loading';
      state.forgotPasswordError = null;
    },
    forgotPasswordSucceeded: state => {
      state.forgotPasswordStatus = 'success';
    },
    forgotPasswordFailed: (state, action: PayloadAction<{ message: string }>) => {
      state.forgotPasswordStatus = 'error';
      state.forgotPasswordError = action.payload.message;
    },

    resetPasswordRequested: (state, _action: PayloadAction<{ token: string; newPassword: string }>) => {
      state.resetPasswordStatus = 'loading';
      state.resetPasswordError = null;
    },
    resetPasswordSucceeded: state => {
      state.resetPasswordStatus = 'success';
    },
    // Covers every failure the backend can send for this endpoint — invalid
    // link (400), already-expired link (410), and "must differ from current
    // password" (400) — the backend's own message is user-appropriate for
    // all three, no special-casing needed.
    resetPasswordFailed: (state, action: PayloadAction<{ message: string }>) => {
      state.resetPasswordStatus = 'error';
      state.resetPasswordError = action.payload.message;
    },
  },
});

export const authActions = authSlice.actions;
