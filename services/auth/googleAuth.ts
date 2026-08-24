/**
 * Real Google Sign-In via @react-native-google-signin/google-signin — NOT a
 * fake browser-chrome sheet. All the configuration this needs lives in
 * config/authConfig.ts — see that file for the step-by-step setup. Nothing
 * else here needs to change once those values are filled in.
 */
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { GOOGLE_IOS_CLIENT_ID, GOOGLE_WEB_CLIENT_ID, isGoogleSignInConfigured } from '../../config/authConfig';

let configured = false;
function ensureConfigured() {
  if (configured) return;
  GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID || undefined,
  });
  configured = true;
}

export type GoogleAuthProfile = {
  email: string;
  firstName: string;
  lastName: string;
  /** POSTed to /auth/google — the backend verifies it against Google rather
   * than trusting the email/name above, which a client could fabricate. */
  idToken: string;
};

/** Returns null if the user backs out of the native sheet — that's not an error. */
export async function signInWithGoogle(): Promise<GoogleAuthProfile | null> {
  if (!isGoogleSignInConfigured()) {
    throw new Error(
      'Google sign-in is not configured yet — fill in GOOGLE_WEB_CLIENT_ID in config/authConfig.ts.',
    );
  }
  ensureConfigured();
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const response = await GoogleSignin.signIn();
  if (!response || response.type !== 'success') return null;
  const { email, givenName, familyName } = response.data.user;
  const { idToken } = response.data;
  if (!idToken) {
    throw new Error('Google did not return an ID token — check the webClientId in config/authConfig.ts.');
  }
  return { email, firstName: givenName ?? '', lastName: familyName ?? '', idToken };
}

export function isUserCancelledGoogleSignIn(err: unknown): boolean {
  return (err as { code?: string } | null)?.code === statusCodes.SIGN_IN_CANCELLED;
}
