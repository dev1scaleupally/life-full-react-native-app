import type { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeLatest } from 'redux-saga/effects';
import { onboardingApi } from '../../services/api/onboardingApi';
import { ApiError, type OnboardingCatalog, type OnboardingResult, type OnboardingSubmission } from '../../services/api/types';
import { onboardingActions } from './onboardingSlice';

function errorMessage(err: unknown): string {
  return err instanceof ApiError ? err.message : 'Something went wrong. Please try again.';
}

function* handleCatalogRequested() {
  try {
    const catalog: OnboardingCatalog = yield call(onboardingApi.getCatalog);
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

export function* onboardingSaga() {
  yield takeLatest(onboardingActions.catalogRequested.type, handleCatalogRequested);
  yield takeLatest(onboardingActions.responsesSubmitted.type, handleResponsesSubmitted);
}
