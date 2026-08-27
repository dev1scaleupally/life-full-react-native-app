import { all, call, fork, put } from 'redux-saga/effects';
import { tokenStore } from '../services/api/tokenStore';
import { authActions } from './auth/authSlice';
import { authSaga } from './auth/authSaga';
import { chatSaga } from './chat/chatSaga';
import { onboardingSaga } from './onboarding/onboardingSaga';
import { progressSaga } from './progress/progressSaga';
import { remindersSaga } from './reminders/remindersSaga';
import { subscriptionSaga } from './subscription/subscriptionSaga';
import { tasksSaga } from './tasks/tasksSaga';

export function* rootSaga() {
  // fork, not call. Every one of these registers takeLatest/takeEvery
  // watchers and then never returns on its own — call() waits for a saga's
  // entire forked subtree to settle, not just its own generator body, so
  // calling a saga that leaves a live watcher running blocks forever. This
  // was the actual bug behind "session vanishes on reload": bootstrapped
  // never flipped true because rootSaga never got past this line, in either
  // ordering. fork() starts each one and returns immediately, which is what
  // actually lets hydrate + refreshRequested below ever run.
  yield all([
    fork(authSaga),
    fork(onboardingSaga),
    fork(chatSaga),
    fork(tasksSaga),
    fork(remindersSaga),
    fork(progressSaga),
    fork(subscriptionSaga),
  ]);

  // Load any session persisted from a previous launch, then validate/rotate
  // it — this is what flips auth.bootstrapped. Must run after the fork
  // above, since authSaga's takeLatest(refreshRequested) has to already be
  // listening for this dispatch to be caught.
  yield call([tokenStore, tokenStore.hydrate]);
  yield put(authActions.refreshRequested());
}
