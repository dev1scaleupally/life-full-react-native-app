import { call, put, takeLatest } from 'redux-saga/effects';
import { progressApi } from '../../services/api/progressApi';
import { ApiError, type Progress } from '../../services/api/types';
import { progressActions } from './progressSlice';

function errorMessage(err: unknown): string {
  return err instanceof ApiError ? err.message : 'Something went wrong. Please try again.';
}

function* handleRequested() {
  try {
    const data: Progress = yield call(progressApi.get);
    yield put(progressActions.succeeded(data));
  } catch (err) {
    yield put(progressActions.failed({ message: errorMessage(err) }));
  }
}

export function* progressSaga() {
  yield takeLatest(progressActions.requested.type, handleRequested);
}
