import type {
  BindCode,
  CreateFavoriteInput,
  CreateGoalInput,
  Favorite,
  Goal,
  LinkedAccounts,
  ModDevice,
  NotificationSettings
} from '@bronevik/schemas';

import {
  meControllerAddFavorite,
  meControllerAddGoal,
  meControllerLinkedAccounts,
  meControllerListFavorites,
  meControllerListGoals,
  meControllerNotificationSettings,
  meControllerRemoveFavorite,
  meControllerRemoveGoal,
  meControllerUpdateNotificationSettings,
  modControllerIssueCode,
  modControllerList,
  modControllerRevoke
} from '../generated';
import { SESSION_REQUEST } from '../http';
import { fromSdk } from '../source';

export const getFavorites = (): Promise<Favorite[]> => fromSdk(() => meControllerListFavorites(SESSION_REQUEST));

export const addFavorite = (input: CreateFavoriteInput): Promise<Favorite> =>
  fromSdk(() => meControllerAddFavorite({ ...SESSION_REQUEST, body: input }));

export const removeFavorite = async (id: string): Promise<void> => {
  await fromSdk(() => meControllerRemoveFavorite({ ...SESSION_REQUEST, path: { id } }));
};

export const getGoals = (): Promise<Goal[]> => fromSdk(() => meControllerListGoals(SESSION_REQUEST));

export const addGoal = (input: CreateGoalInput): Promise<Goal> => fromSdk(() => meControllerAddGoal({ ...SESSION_REQUEST, body: input }));

export const removeGoal = async (id: string): Promise<void> => {
  await fromSdk(() => meControllerRemoveGoal({ ...SESSION_REQUEST, path: { id } }));
};

export const getNotificationSettings = (): Promise<NotificationSettings> => fromSdk(() => meControllerNotificationSettings(SESSION_REQUEST));

export const updateNotificationSettings = (patch: Partial<NotificationSettings>): Promise<NotificationSettings> =>
  fromSdk(() => meControllerUpdateNotificationSettings({ ...SESSION_REQUEST, body: patch }));

export const getLinkedAccounts = (): Promise<LinkedAccounts> => fromSdk(() => meControllerLinkedAccounts(SESSION_REQUEST));

export const issueBindCode = (accountId?: number): Promise<BindCode> =>
  fromSdk(() => modControllerIssueCode({ ...SESSION_REQUEST, body: { accountId } }));

export const getModDevices = (): Promise<ModDevice[]> => fromSdk(() => modControllerList(SESSION_REQUEST));

export const revokeModDevice = async (id: string): Promise<void> => {
  await fromSdk(() => modControllerRevoke({ ...SESSION_REQUEST, path: { id } }));
};
