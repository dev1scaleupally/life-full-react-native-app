import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Progress } from '../../services/api/types';

export type ProgressState = {
  data: Progress | null;
  status: 'idle' | 'loading' | 'error';
  error: string | null;
};

const initialState: ProgressState = {
  data: null,
  status: 'idle',
  error: null,
};

export const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    requested: state => {
      state.status = 'loading';
      state.error = null;
    },
    succeeded: (state, action: PayloadAction<Progress>) => {
      state.status = 'idle';
      state.data = action.payload;
    },
    failed: (state, action: PayloadAction<{ message: string }>) => {
      state.status = 'error';
      state.error = action.payload.message;
    },
  },
});

export const progressActions = progressSlice.actions;
