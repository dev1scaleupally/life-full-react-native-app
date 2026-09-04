import type { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeLatest } from 'redux-saga/effects';
import { authApi } from '../../services/api/authApi';
import { tokenStore } from '../../services/api/tokenStore';
import {
  ApiError,
  type AppleLoginInput,
  type AuthSession,
  type GoogleLoginInput,
  type RegisterInput,
  type ResetPasswordResult,
} from '../../services/api/types';
import { authActions } from './authSlice';

function errorMessage(err: unknown): string {
  return err instanceof ApiError ? err.message : 'Something went wrong. Please try again.';
}

// POST /auth/register's 409 is the backend's raw "An account with this email
// already exists" — the banner needs the friendlier, actionable version.
function registerErrorMessage(err: unknown): string {
  if (err instanceof ApiError && err.statusCode === 409) {
    return 'An account already exists for this email. Sign in instead, or use a different address.';
  }
  return errorMessage(err);
}

// POST /auth/login already returns one identical 401 for both "no such
// email" and "wrong password" (see auth.service.ts) so it can't be used to
// probe whether an account exists — this just swaps its raw "Invalid email
// or password" for the UI's copy, without adding any field-level attribution
// the backend didn't already avoid.
function loginErrorMessage(err: unknown): string {
  if (err instanceof ApiError && err.statusCode === 401) {
    return "We couldn't sign you in. Check your email and password, then try again.";
  }
  return errorMessage(err);
}

function* establishSession(session: AuthSession) {
  yield call([tokenStore, tokenStore.set], session);
  yield put(authActions.authSucceeded({ userId: session.userId, emailVerified: session.emailVerified }));
}

function* handleRegister(action: PayloadAction<RegisterInput>) {
  console.log('[auth] registration submitted:', { ...action.payload, password: '••••••••' });
  try {
    const session: AuthSession = yield call(authApi.register, action.payload);
    console.log('[auth] registration succeeded:', { userId: session.userId, emailVerified: session.emailVerified });
    yield* establishSession(session);
  } catch (err) {
    console.log('[auth] registration failed:', errorMessage(err));
    yield put(authActions.authFailed({ message: registerErrorMessage(err) }));
  }
}

function* handleLogin(action: PayloadAction<{ email: string; password: string }>) {
  try {
    const session: AuthSession = yield call(authApi.login, action.payload.email, action.payload.password);
    yield* establishSession(session);
  } catch (err) {
    yield put(authActions.authFailed({ message: loginErrorMessage(err) }));
  }
}

function* handleGoogleLogin(action: PayloadAction<GoogleLoginInput>) {
  try {
    const session: AuthSession = yield call(authApi.google, action.payload);
    yield* establishSession(session);
  } catch (err) {
    yield put(authActions.authFailed({ message: errorMessage(err) }));
  }
}

function* handleAppleLogin(action: PayloadAction<AppleLoginInput>) {
  try {
    const session: AuthSession = yield call(authApi.apple, action.payload);
    yield* establishSession(session);
  } catch (err) {
    yield put(authActions.authFailed({ message: errorMessage(err) }));
  }
}

/** Runs once at launch (see rootSaga) to validate/rotate any stored session,
 * and can be re-dispatched any time to force a rotation. Deliberately quiet
 * on failure — an invalid stored token at launch just means "logged out",
 * not an error banner. */
function* handleRefresh() {
  const current = tokenStore.get();
  if (!current) {
    yield put(authActions.bootstrapCompleted(null));
    return;
  }
  try {
    const rotated: Awaited<ReturnType<typeof authApi.refresh>> = yield call(authApi.refresh, current.refreshToken);
    yield call([tokenStore, tokenStore.set], rotated);
    yield put(authActions.bootstrapCompleted({ userId: rotated.userId }));
  } catch {
    yield call([tokenStore, tokenStore.clear]);
    yield put(authActions.bootstrapCompleted(null));
  }
}

function* handleLoggedOut() {
  yield call([tokenStore, tokenStore.clear]);
}

function* handleVerifyEmail(action: PayloadAction<{ token: string }>) {
  try {
    yield call(authApi.verifyEmail, action.payload.token);
    yield put(authActions.verifyEmailSucceeded());
  } catch (err) {
    yield put(authActions.verifyEmailFailed({ message: errorMessage(err) }));
  }
}

function* handleResendVerification(action: PayloadAction<{ email: string }>) {
  try {
    yield call(authApi.resendVerification, action.payload.email);
    yield put(authActions.resendVerificationSucceeded());
  } catch (err) {
    yield put(authActions.resendVerificationFailed({ message: errorMessage(err) }));
  }
}

function* handleForgotPassword(action: PayloadAction<{ email: string }>) {
  try {
    yield call(authApi.forgotPassword, action.payload.email);
    yield put(authActions.forgotPasswordSucceeded());
  } catch (err) {
    yield put(authActions.forgotPasswordFailed({ message: errorMessage(err) }));
  }
}

function* handleResetPassword(action: PayloadAction<{ token: string; password: string }>) {
  try {
    const result: ResetPasswordResult = yield call(
      authApi.resetPassword,
      action.payload.token,
      action.payload.password,
    );
    yield put(authActions.resetPasswordSucceeded({ email: result.email }));
  } catch (err) {
    // 410 = expired, and the backend echoes back the address it belonged to
    // (the link itself carries only a token) — same shape as verify-email's
    // 410, see deepLinks.ts.
    if (err instanceof ApiError && err.statusCode === 410 && err.email) {
      yield put(authActions.resetPasswordExpired({ email: err.email }));
      return;
    }
    yield put(authActions.resetPasswordFailed({ message: errorMessage(err) }));
  }
}

export function* authSaga() {
  yield takeLatest(authActions.registerRequested.type, handleRegister);
  yield takeLatest(authActions.loginRequested.type, handleLogin);
  yield takeLatest(authActions.googleLoginRequested.type, handleGoogleLogin);
  yield takeLatest(authActions.appleLoginRequested.type, handleAppleLogin);
  yield takeLatest(authActions.refreshRequested.type, handleRefresh);
  yield takeLatest(authActions.loggedOut.type, handleLoggedOut);
  yield takeLatest(authActions.verifyEmailRequested.type, handleVerifyEmail);
  yield takeLatest(authActions.resendVerificationRequested.type, handleResendVerification);
  yield takeLatest(authActions.forgotPasswordRequested.type, handleForgotPassword);
  yield takeLatest(authActions.resetPasswordRequested.type, handleResetPassword);
}
