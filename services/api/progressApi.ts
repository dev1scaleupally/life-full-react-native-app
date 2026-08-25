import { httpClient } from './httpClient';
import type { Progress } from './types';

export const progressApi = {
  /** GET /v1/progress — baseline + every re-administration as one ordered
   * series per domain, plus Cognitive Alignment and Overall Wellbeing. Right
   * after onboarding submit, each series' first point IS the onboarding
   * baseline (POST /onboarding/responses itself only returns domainScores +
   * priorityOrder — cognitiveAlignmentScore/overallWellbeingScore are
   * deliberately withheld there and only surface here). */
  get: () => httpClient.get<Progress>('/progress').then(res => res.data),
};
