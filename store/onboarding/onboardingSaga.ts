import type { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeLatest } from 'redux-saga/effects';
import { onboardingApi } from '../../services/api/onboardingApi';
import {
  ApiError,
  type OnboardingCatalog,
  type OnboardingResult,
  type OnboardingScorePreview,
  type OnboardingSubmission,
} from '../../services/api/types';
import { checkCatalogDrift } from '../../utils/onboardingCatalogCheck';
import { onboardingActions } from './onboardingSlice';

function errorMessage(err: unknown): string {
  return err instanceof ApiError ? err.message : 'Something went wrong. Please try again.';
}

function* handleCatalogRequested() {
  try {
    const catalog: OnboardingCatalog = yield call(onboardingApi.getCatalog);
    // components/onboarding/types.ts's STEPS and components/reflections/
    // types.ts's DOMAINS are hand-copied from this same catalog, not
    // rendered from it live — this is the ongoing check that they haven't
    // silently drifted apart. Warn-only: the hardcoded copies remain what
    // actually drives the form/scoring either way.
    const issues = checkCatalogDrift(catalog);
    if (issues.length > 0) {
      console.warn(`[onboardingSaga] GET /onboarding/catalog drifted from the hardcoded STEPS/DOMAINS:\n${issues.join('\n')}`);
    }
    yield put(onboardingActions.catalogSucceeded(catalog));
  } catch (err) {
    yield put(onboardingActions.catalogFailed({ message: errorMessage(err) }));
  }
}

function* handleResponsesSubmitted(action: PayloadAction<OnboardingSubmission>) {
  try {
    const result: OnboardingResult = yield call(onboardingApi.submitResponses, action.payload);
    yield put(onboardingActions.submitSucceeded(result));
  } catch (err) {
    yield put(onboardingActions.submitFailed({ message: errorMessage(err) }));
  }
}

function* handleScoreRequested(action: PayloadAction<OnboardingSubmission>) {
  try {
    const score: OnboardingScorePreview = yield call(onboardingApi.score, action.payload);
    yield put(onboardingActions.scoreSucceeded(score));
  } catch (err) {
    yield put(onboardingActions.scoreFailed({ message: errorMessage(err) }));
  }
}

export function* onboardingSaga() {
  yield takeLatest(onboardingActions.catalogRequested.type, handleCatalogRequested);
  yield takeLatest(onboardingActions.responsesSubmitted.type, handleResponsesSubmitted);
  yield takeLatest(onboardingActions.scoreRequested.type, handleScoreRequested);
}
