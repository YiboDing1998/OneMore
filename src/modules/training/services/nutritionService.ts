import { apiClient } from '@/src/data/api/client';
import { ApiResponse } from '@/src/core/types';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

export interface DailyMealItem {
  id?: string;
  mealType?: MealType | string;
  name: string;
  amount?: string;
  image?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

export interface DailyNutritionTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface DailyNutritionLog {
  id: string;
  userId: string;
  date: string;
  meals: DailyMealItem[];
  totals: DailyNutritionTotals;
  updatedAt: string;
}

export async function getDailyNutrition(date: string) {
  const response = await apiClient.get<ApiResponse<{ log: DailyNutritionLog }>>(
    '/nutrition/daily',
    { date }
  );

  if (!response.success || !response.data?.log) {
    throw new Error('Failed to load daily nutrition data');
  }

  return response.data.log;
}

export async function upsertDailyNutrition(payload: {
  date: string;
  meals: DailyMealItem[];
  totals?: DailyNutritionTotals;
}) {
  const response = await apiClient.post<ApiResponse<{ log: DailyNutritionLog }>>(
    '/nutrition/daily',
    payload
  );

  if (!response.success || !response.data?.log) {
    throw new Error('Failed to save daily nutrition data');
  }

  return response.data.log;
}
