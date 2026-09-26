import type { z } from 'zod';

import type {
  createFavoriteSchema,
  createGoalSchema,
  favoriteKindSchema,
  favoriteSchema,
  favoritesSchema,
  goalMetricSchema,
  goalSchema,
  goalsSchema,
  goalStatusSchema,
  linkedAccountsSchema,
  sessionExtrasSchema,
  updateGoalSchema
} from './me.schemas';

export type FavoriteKind = z.infer<typeof favoriteKindSchema>;
export type Favorite = z.infer<typeof favoriteSchema>;
export type Favorites = z.infer<typeof favoritesSchema>;
export type CreateFavoriteInput = z.infer<typeof createFavoriteSchema>;
export type GoalMetric = z.infer<typeof goalMetricSchema>;
export type GoalStatus = z.infer<typeof goalStatusSchema>;
export type Goal = z.infer<typeof goalSchema>;
export type Goals = z.infer<typeof goalsSchema>;
export type CreateGoalInput = z.infer<typeof createGoalSchema>;
export type UpdateGoalInput = z.infer<typeof updateGoalSchema>;
export type LinkedAccounts = z.infer<typeof linkedAccountsSchema>;
export type SessionExtras = z.infer<typeof sessionExtrasSchema>;
