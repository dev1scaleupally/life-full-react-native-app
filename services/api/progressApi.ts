import { httpClient } from './httpClient';
import type { Progress } from './types';

export const progressApi = {
  get: () => httpClient.get<Progress>('/progress').then(res => res.data),
};
