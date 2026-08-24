import { httpClient } from './httpClient';
import type { CreateTaskInput, ReviewTaskInput, Task } from './types';

export const tasksApi = {
  list: () => httpClient.get<Task[]>('/tasks').then(res => res.data),

  create: (input: CreateTaskInput) => httpClient.post<Task>('/tasks', input).then(res => res.data),

  complete: (id: string) => httpClient.patch<Task>(`/tasks/${id}/complete`).then(res => res.data),

  review: (id: string, input: ReviewTaskInput) =>
    httpClient.patch<Task>(`/tasks/${id}/review`, input).then(res => res.data),
};
