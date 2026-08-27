import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { setOnSessionExpired } from '../services/api/httpClient';
import { authActions, authSlice } from './auth/authSlice';
import { chatSlice } from './chat/chatSlice';
import { onboardingSlice } from './onboarding/onboardingSlice';
import { progressSlice } from './progress/progressSlice';
import { remindersSlice } from './reminders/remindersSlice';
import { rootSaga } from './rootSaga';
import { subscriptionSlice } from './subscription/subscriptionSlice';
import { tasksSlice } from './tasks/tasksSlice';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    onboarding: onboardingSlice.reducer,
    chat: chatSlice.reducer,
    tasks: tasksSlice.reducer,
    reminders: remindersSlice.reducer,
    progress: progressSlice.reducer,
    subscription: subscriptionSlice.reducer,
  },
  // redux-saga replaces thunk as the async layer; every request in
  // services/api is triggered from a saga, never a thunk.
  middleware: getDefaultMiddleware => getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

// A 401 that survives httpClient's own refresh attempt means the session is
// truly gone — reflect that into redux so the UI can react (e.g. bounce to
// the auth stack) without httpClient needing to import the store directly.
setOnSessionExpired(() => store.dispatch(authActions.sessionExpired()));

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
