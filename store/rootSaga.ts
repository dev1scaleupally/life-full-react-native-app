import { all, call, put } from 'redux-saga/effects';
import { tokenStore } from '../services/api/tokenStore';
import { authActions } from './auth/authSlice';
import { authSaga } from './auth/authSaga';
import { chatSaga } from './chat/chatSaga';
import { onboardingSaga } from './onboarding/onboardingSaga';
import { progressSaga } from './progress/progressSaga';
import { remindersSaga } from './reminders/remindersSaga';
import { tasksSaga } from './tasks/tasksSaga';

export function* rootSaga() {
  // Load any session persisted from a previous launch before anything else
  // runs, then validate/rotate it — this is what flips auth.bootstrapped.
  yield call([tokenStore, tokenStore.hydrate]);
  yield put(authActions.refreshRequested());

  yield all([
    call(authSaga),
    call(onboardingSaga),
    call(chatSaga),
    call(tasksSaga),
    call(remindersSaga),
    call(progressSaga),
  ]);
}
