import type {
  CreateFavoriteInput as CreateFavoriteBody,
  CreateGoalInput as CreateGoalBody,
  Favorite,
  Goal,
  LinkedAccounts,
  ModGoals,
  NotificationSettings,
  UpdateGoalInput as UpdateGoalBody
} from '@otmetki/schemas';

import type { GoalWindow } from './lib';

export type { Favorite, Goal, LinkedAccounts, ModGoals };

export type CreateFavoriteInput = CreateFavoriteBody & { userId: string };
export type CreateGoalInput = CreateGoalBody & { userId: string };
export type UpdateGoalInput = UpdateGoalBody & { userId: string; id: string };

export type OwnedInput = {
  userId: string;
  id: string;
};

export type AccountLinkInput = {
  userId: string;
  accountId: number;
};

export type UpdateNotificationsInput = Partial<NotificationSettings> & {
  userId: string;
};

export type BaselineInput = {
  accountId: bigint;
  metric: Goal['metric'];
  tankId: number | null;
};

export type HangarGoalsInput = {
  userId: string;
  accountId: bigint;
  now?: Date;
};

export type GoalBattlesQueryInput = {
  accountId: bigint;
  tankId: number | null;
  window: GoalWindow;
};
