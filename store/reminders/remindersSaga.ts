import { call, put, takeLatest } from 'redux-saga/effects';
import { remindersApi } from '../../services/api/remindersApi';
import { ApiError, type Reminder } from '../../services/api/types';
import { remindersActions } from './remindersSlice';

function errorMessage(err: unknown): string {
  return err instanceof ApiError ? err.message : 'Something went wrong. Please try again.';
}

function* handleListRequested() {
  try {
    const items: Reminder[] = yield call(remindersApi.list);
    yield put(remindersActions.listSucceeded(items));
  } catch (err) {
    yield put(remindersActions.listFailed({ message: errorMessage(err) }));
  }
}

export function* remindersSaga() {
  yield takeLatest(remindersActions.listRequested.type, handleListRequested);
}
