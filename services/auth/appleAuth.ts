/**
 * Real Sign in with Apple via @invertase/react-native-apple-authentication —
 * NOT a fake browser-chrome sheet. iOS only. One-time native setup still
 * needed before this actually authenticates:
 *
 *   1. `cd ios && pod install` (the JS package is already in package.json).
 *   2. In Xcode: target > Signing & Capabilities > add "Sign In with Apple".
 *
 * Apple only ever returns the user's name/email on the FIRST authorization —
 * POST /auth/apple persists it then, since later sign-ins won't repeat it
 * (see AccountGateScreen's handleOAuth, which drops empty strings back to
 * undefined rather than passing them as if they were real).
 */
import { Platform } from 'react-native';
import appleAuth from '@invertase/react-native-apple-authentication';

export type AppleAuthProfile = {
  email: string;
  firstName: string;
  lastName: string;
  /** POSTed to /auth/apple — the backend verifies it against Apple rather
   * than trusting the email/name above, which a client could fabricate. */
  identityToken: string;
};

/** Returns null if the credential comes back unauthorized (user backed out). */
export async function signInWithApple(): Promise<AppleAuthProfile | null> {
  if (Platform.OS !== 'ios') {
    throw new Error('Sign in with Apple is only available on iOS.');
  }
  const response = await appleAuth.performRequest({
    requestedOperation: appleAuth.Operation.LOGIN,
    requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
  });
  const credentialState = await appleAuth.getCredentialStateForUser(response.user);
  if (credentialState !== appleAuth.State.AUTHORIZED) return null;
  if (!response.identityToken) {
    throw new Error('Apple did not return an identity token.');
  }
  return {
    email: response.email ?? '',
    firstName: response.fullName?.givenName ?? '',
    lastName: response.fullName?.familyName ?? '',
    identityToken: response.identityToken,
  };
}
