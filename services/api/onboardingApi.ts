import { httpClient } from './httpClient';
import type { OnboardingCatalog, OnboardingResult, OnboardingSubmission } from './types';

export const onboardingApi = {
  getCatalog: () => httpClient.get<OnboardingCatalog>('/onboarding/catalog').then(res => res.data),

  submitResponses: (submission: OnboardingSubmission) =>
    httpClient.post<OnboardingResult>('/onboarding/responses', submission).then(res => res.data),
};
