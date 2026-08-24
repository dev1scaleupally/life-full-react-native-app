import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Reminder } from '../../services/api/types';

export type RemindersState = {
  items: Reminder[];
  status: 'idle' | 'loading' | 'error';
  error: string | null;
};

const initialState: RemindersState = {
  items: [],
  status: 'idle',
  error: null,
};

export const remindersSlice = createSlice({
  name: 'reminders',
  initialState,
  reducers: {
    listRequested: state => {
      state.status = 'loading';
      state.error = null;
    },
    listSucceeded: (state, action: PayloadAction<Reminder[]>) => {
      state.status = 'idle';
      state.items = action.payload;
    },
    listFailed: (state, action: PayloadAction<{ message: string }>) => {
      state.status = 'error';
      state.error = action.payload.message;
    },
  },
});

export const remindersActions = remindersSlice.actions;
