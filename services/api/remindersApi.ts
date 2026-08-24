import { httpClient } from './httpClient';
import type { Reminder } from './types';

export const remindersApi = {
  list: () => httpClient.get<Reminder[]>('/reminders').then(res => res.data),
};
