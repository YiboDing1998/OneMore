import { apiClient } from '@/src/data/api/client';
import { ApiResponse } from '@/src/core/types';

export interface WorkoutRecordItem {
  id: string;
  userId: string;
  title: string;
  duration: number;
  volume: number;
  bpm: number;
  image?: string | null;
  date: string;
}

export interface WorkoutRecordStats {
  workouts: number;
  totalVolume: number;
  avgTime: number;
  activeDays: number;
}

export async function getRecords(date?: string) {
  const params = date ? { date } : undefined;
  const response = await apiClient.get<
    ApiResponse<{ records: WorkoutRecordItem[]; stats: WorkoutRecordStats }>
  >('/records', params);

  if (!response.success || !response.data) {
    throw new Error('Failed to load records');
  }

  return response.data;
}

export async function createRecord(payload: {
  title: string;
  duration: number;
  volume: number;
  bpm?: number;
  image?: string;
}) {
  const response = await apiClient.post<ApiResponse<{ record: WorkoutRecordItem }>>(
    '/records',
    payload
  );

  if (!response.success || !response.data) {
    throw new Error('Failed to create record');
  }

  return response.data.record;
}

export async function updateRecord(
  id: string,
  payload: Partial<Pick<WorkoutRecordItem, 'title' | 'duration' | 'volume' | 'bpm'>>
) {
  const response = await apiClient.put<ApiResponse<{ record: WorkoutRecordItem }>>(
    `/records/${id}`,
    payload
  );

  if (!response.success || !response.data) {
    throw new Error('Failed to update record');
  }

  return response.data.record;
}

export async function deleteRecord(id: string) {
  const response = await apiClient.delete<ApiResponse<{ deleted: boolean }>>(
    `/records/${id}`
  );

  if (!response.success) {
    throw new Error('Failed to delete record');
  }

  return true;
}
