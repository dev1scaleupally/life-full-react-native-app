import type { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { tasksApi } from '../../services/api/tasksApi';
import { ApiError, type CreateTaskInput, type ReviewTaskInput, type Task } from '../../services/api/types';
import { tasksActions } from './tasksSlice';

function errorMessage(err: unknown): string {
  return err instanceof ApiError ? err.message : 'Something went wrong. Please try again.';
}

function* handleListRequested() {
  try {
    const items: Task[] = yield call(tasksApi.list);
    yield put(tasksActions.listSucceeded(items));
  } catch (err) {
    yield put(tasksActions.listFailed({ message: errorMessage(err) }));
  }
}

function* handleCreateRequested(action: PayloadAction<CreateTaskInput>) {
  try {
    const task: Task = yield call(tasksApi.create, action.payload);
    yield put(tasksActions.createSucceeded(task));
  } catch (err) {
    yield put(tasksActions.createFailed({ message: errorMessage(err) }));
  }
}

// takeEvery, not takeLatest — completing/reviewing task A must not be
// cancelled by a concurrent action on task B.
function* handleCompleteRequested(action: PayloadAction<{ id: string }>) {
  try {
    const task: Task = yield call(tasksApi.complete, action.payload.id);
    yield put(tasksActions.completeSucceeded(task));
  } catch (err) {
    yield put(tasksActions.completeFailed({ id: action.payload.id, message: errorMessage(err) }));
  }
}

function* handleReviewRequested(action: PayloadAction<{ id: string; input: ReviewTaskInput }>) {
  try {
    const task: Task = yield call(tasksApi.review, action.payload.id, action.payload.input);
    yield put(tasksActions.reviewSucceeded(task));
  } catch (err) {
    yield put(tasksActions.reviewFailed({ id: action.payload.id, message: errorMessage(err) }));
  }
}

export function* tasksSaga() {
  yield takeLatest(tasksActions.listRequested.type, handleListRequested);
  yield takeLatest(tasksActions.createRequested.type, handleCreateRequested);
  yield takeEvery(tasksActions.completeRequested.type, handleCompleteRequested);
  yield takeEvery(tasksActions.reviewRequested.type, handleReviewRequested);
}
