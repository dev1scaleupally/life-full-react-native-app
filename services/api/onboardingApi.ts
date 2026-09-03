import { httpClient } from './httpClient';
import type { OnboardingCatalog, OnboardingResult, OnboardingScorePreview, OnboardingSubmission } from './types';

export const onboardingApi = {
  getCatalog: () => httpClient.get<OnboardingCatalog>('/onboarding/catalog').then(res => res.data),

  submitResponses: (submission: OnboardingSubmission) =>
    httpClient.post<OnboardingResult>('/onboarding/responses', submission).then(res => res.data),

  /** Public — no account needed. See OnboardingScorePreview. */
  score: (submission: OnboardingSubmission) =>
    httpClient.post<OnboardingScorePreview>('/onboarding/score', submission).then(res => res.data),
};
