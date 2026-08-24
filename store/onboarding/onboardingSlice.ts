import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { OnboardingCatalog, OnboardingResult, OnboardingSubmission } from '../../services/api/types';

export type OnboardingState = {
  catalog: OnboardingCatalog | null;
  catalogStatus: 'idle' | 'loading' | 'error';
  catalogError: string | null;
  result: OnboardingResult | null;
  submitStatus: 'idle' | 'loading' | 'error';
  submitError: string | null;
};

const initialState: OnboardingState = {
  catalog: null,
  catalogStatus: 'idle',
  catalogError: null,
  result: null,
  submitStatus: 'idle',
  submitError: null,
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
  },
});

export const onboardingActions = onboardingSlice.actions;
