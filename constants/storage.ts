/**
 * AsyncStorage keys shared across features. Keep this the single source so a
 * key never gets typo'd differently in the writer vs. the reader.
 */
export const STORAGE_KEYS = {
  /** First name captured during onboarding (see components/onboarding), read
   * by EmailFormScreen to pre-fill signup's "First name" field. */
  onboardingName: 'lf_onboarding_name',
  /** Real backend session tokens (see services/api/httpClient.ts and
   * store/auth) — distinct from authService.ts's mock account storage. */
  accessToken: 'lf_access_token',
  refreshToken: 'lf_refresh_token',
  userId: 'lf_user_id',
  /** JSON {firstName, lastName} — cached the moment an interactive sign-in
   * actually learns a real name (there's no GET /me endpoint), so a plain
   * app reopen's silent session restore (rootSaga's bootstrap) has
   * something better than blank to show on Profile/Settings. Best-effort
   * only: goes stale if the account's name changes elsewhere, and a fresh
   * device/reinstall starts with nothing cached either. */
  accountName: 'lf_account_name',
} as const;
