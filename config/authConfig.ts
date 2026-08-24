/**
 * The ONLY file you need to edit to turn on Google sign-in for real.
 *
 * Where to get these values: https://console.cloud.google.com/apis/credentials
 *   1. Create an OAuth 2.0 Client ID of type "iOS" — bundle ID must match
 *      ios/lifeFullApp.xcodeproj's PRODUCT_BUNDLE_IDENTIFIER.
 *   2. Create a second OAuth 2.0 Client ID of type "Web application" — this
 *      is the one Google Sign-In actually calls `webClientId`.
 *   3. Paste both client IDs below.
 *   4. Take the iOS client ID (looks like
 *      "1234-abc.apps.googleusercontent.com"), reverse it to
 *      "com.googleusercontent.apps.1234-abc", and paste THAT into
 *      ios/lifeFullApp/Info.plist's CFBundleURLTypes as a new
 *      CFBundleURLSchemes entry (the app already has one entry there for the
 *      "lifefull" deep-link scheme — add this as a second <dict> in the same
 *      array, don't replace it).
 *   5. `cd ios && pod install`, rebuild.
 *
 * Sign In with Apple needs no token here — it's an Xcode/Apple Developer
 * Portal capability (already wired: see ios/lifeFullApp/lifeFullApp.entitlements
 * and the CODE_SIGN_ENTITLEMENTS build setting). If your Apple Developer
 * account's App ID doesn't have "Sign In with Apple" enabled yet, Xcode will
 * offer to enable it automatically the first time you build with your team
 * selected under Signing & Capabilities.
 */
export const GOOGLE_WEB_CLIENT_ID = '802707665550-kpi9imur608l13vgu8aeecus957l4d94.apps.googleusercontent.com';
export const GOOGLE_IOS_CLIENT_ID = '802707665550-63gklm1r0jpdu6trtq0adf3n0ej2e00c.apps.googleusercontent.com';

export const isGoogleSignInConfigured = () =>
  GOOGLE_WEB_CLIENT_ID.length > 0 && GOOGLE_WEB_CLIENT_ID.includes('.apps.googleusercontent.com');
