import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CreateTaskInput, ReviewTaskInput, Task } from '../../services/api/types';

export type TasksState = {
  items: Task[];
  listStatus: 'idle' | 'loading' | 'error';
  listError: string | null;
  createStatus: 'idle' | 'loading' | 'error';
  createError: string | null;
  /** taskId -> in-flight, so a screen can disable just the row being acted on. */
  completingIds: string[];
  reviewingIds: string[];
  actionError: string | null;
};

const initialState: TasksState = {
  items: [],
  listStatus: 'idle',
  listError: null,
  createStatus: 'idle',
  createError: null,
  completingIds: [],
  reviewingIds: [],
  actionError: null,
};

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    listRequested: state => {
      state.listStatus = 'loading';
      state.listError = null;
    },
    listSucceeded: (state, action: PayloadAction<Task[]>) => {
      state.listStatus = 'idle';
      state.items = action.payload;
    },
    listFailed: (state, action: PayloadAction<{ message: string }>) => {
      state.listStatus = 'error';
      state.listError = action.payload.message;
    },

    createRequested: (state, _action: PayloadAction<CreateTaskInput>) => {
      state.createStatus = 'loading';
      state.createError = null;
    },
    createSucceeded: (state, action: PayloadAction<Task>) => {
      state.createStatus = 'idle';
      state.items.push(action.payload);
    },
    createFailed: (state, action: PayloadAction<{ message: string }>) => {
      state.createStatus = 'error';
      state.createError = action.payload.message;
    },

    completeRequested: (state, action: PayloadAction<{ id: string }>) => {
      state.completingIds.push(action.payload.id);
      state.actionError = null;
    },
    completeSucceeded: (state, action: PayloadAction<Task>) => {
      state.completingIds = state.completingIds.filter(id => id !== action.payload.id);
      const index = state.items.findIndex(task => task.id === action.payload.id);
      if (index !== -1) state.items[index] = action.payload;
    },
    completeFailed: (state, action: PayloadAction<{ id: string; message: string }>) => {
      state.completingIds = state.completingIds.filter(id => id !== action.payload.id);
      state.actionError = action.payload.message;
    },

    reviewRequested: (state, action: PayloadAction<{ id: string; input: ReviewTaskInput }>) => {
      state.reviewingIds.push(action.payload.id);
      state.actionError = null;
    },
    reviewSucceeded: (state, action: PayloadAction<Task>) => {
      state.reviewingIds = state.reviewingIds.filter(id => id !== action.payload.id);
      const index = state.items.findIndex(task => task.id === action.payload.id);
      if (index !== -1) state.items[index] = action.payload;
    },
    reviewFailed: (state, action: PayloadAction<{ id: string; message: string }>) => {
      state.reviewingIds = state.reviewingIds.filter(id => id !== action.payload.id);
      state.actionError = action.payload.message;
    },
  },
});

export const tasksActions = tasksSlice.actions;
