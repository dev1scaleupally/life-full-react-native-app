import { httpClient } from './httpClient';
import type { Profile, ProfileEnvelope } from './types';

export const profileApi = {
  /** GET /v1/profile — the signed-in user's own core account details
   * (id/email/firstName/lastName/timezone/emailVerifiedAt/createdAt only —
   * no BasicProfile fields like ageRange/careerField/retirementStatus; those
   * live solely in the onboarding submission, not here). Replaces the old
   * GET /v1/auth/me, which never existed on the real backend — see App.tsx's
   * loadProfileFromServer, the only caller. Every /v1/profile response is
   * wrapped in a {status, message, data, errors} envelope; unwrapped here so
   * callers just get the Profile itself. */
  get: () => httpClient.get<ProfileEnvelope>('/profile').then(res => res.data.data),

  /** PATCH /v1/profile — partial update; only the supplied fields change.
   * Not called anywhere yet, added alongside get() since the backend
   * exposes both on the same route. */
  update: (patch: Partial<Pick<Profile, 'firstName' | 'lastName' | 'timezone'>>) =>
    httpClient.patch<ProfileEnvelope>('/profile', patch).then(res => res.data.data),
};
