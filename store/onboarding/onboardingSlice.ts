import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  OnboardingCatalog,
  OnboardingResult,
  OnboardingScorePreview,
  OnboardingSubmission,
} from '../../services/api/types';

export type OnboardingState = {
  catalog: OnboardingCatalog | null;
  catalogStatus: 'idle' | 'loading' | 'error';
  catalogError: string | null;
  result: OnboardingResult | null;
  submitStatus: 'idle' | 'loading' | 'error';
  submitError: string | null;
  /** POST /onboarding/score — the public, pre-signup preview. Separate from
   * `result`/`submitStatus` above (the authenticated, persisting commit). */
  score: OnboardingScorePreview | null;
  scoreStatus: 'idle' | 'loading' | 'error';
  scoreError: string | null;
};

const initialState: OnboardingState = {
  catalog: null,
  catalogStatus: 'idle',
  catalogError: null,
  result: null,
  submitStatus: 'idle',
  submitError: null,
  score: null,
  scoreStatus: 'idle',
  scoreError: null,
};

export const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    catalogRequested: state => {
      state.catalogStatus = 'loading';
      state.catalogError = null;
    },
    catalogSucceeded: (state, action: PayloadAction<OnboardingCatalog>) => {
      state.catalogStatus = 'idle';
      state.catalog = action.payload;
    },
    catalogFailed: (state, action: PayloadAction<{ message: string }>) => {
      state.catalogStatus = 'error';
      state.catalogError = action.payload.message;
    },
    responsesSubmitted: (state, _action: PayloadAction<OnboardingSubmission>) => {
      state.submitStatus = 'loading';
      state.submitError = null;
    },
    submitSucceeded: (state, action: PayloadAction<OnboardingResult>) => {
      state.submitStatus = 'idle';
      state.result = action.payload;
    },
    submitFailed: (state, action: PayloadAction<{ message: string }>) => {
      state.submitStatus = 'error';
      state.submitError = action.payload.message;
    },
    scoreRequested: (state, _action: PayloadAction<OnboardingSubmission>) => {
      state.scoreStatus = 'loading';
      state.scoreError = null;
    },
    scoreSucceeded: (state, action: PayloadAction<OnboardingScorePreview>) => {
      state.scoreStatus = 'idle';
      state.score = action.payload;
    },
    scoreFailed: (state, action: PayloadAction<{ message: string }>) => {
      state.scoreStatus = 'error';
      state.scoreError = action.payload.message;
    },
  },
});

export const onboardingActions = onboardingSlice.actions;
