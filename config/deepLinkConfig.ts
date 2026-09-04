/**
 * The domain the verify-email/reset-password App Links (Android) / Universal
 * Links (iOS) are verified against. Currently the dev API's own domain
 * (matches config/apiConfig.ts's API_BASE_URL) rather than the client's
 * eventual production domain (docs/CLIENT_REQUIREMENTS.md #5) — this lets
 * the whole flow be tested for real right now instead of waiting on that.
 * Swap this AND android/app/src/main/AndroidManifest.xml's matching
 * <intent-filter> host together once the production domain exists — they
 * must match exactly, and it's a different host per environment (dev vs
 * prod), same as API_BASE_URL itself.
 *
 * iOS's Universal Links (com.apple.developer.associated-domains) aren't
 * wired up yet regardless of this value — see the note in
 * ios/lifeFullApp/lifeFullApp.entitlements, blocked on the Apple Developer
 * Program membership (CLIENT_REQUIREMENTS.md #2).
 */
export const APP_LINK_HOST = 'lifefull-apis-dev.scaleupdevops.in';
