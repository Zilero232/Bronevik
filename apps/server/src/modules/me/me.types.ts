import type {
  CreateFavoriteInput as CreateFavoriteBody,
  CreateGoalInput as CreateGoalBody,
  Favorite,
  Goal,
  LinkedAccounts,
  NotificationSettings,
  UpdateGoalInput as UpdateGoalBody
} from '@bronevik/schemas';

export type { Favorite, Goal, LinkedAccounts };

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
