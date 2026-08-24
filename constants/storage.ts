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
} as const;
