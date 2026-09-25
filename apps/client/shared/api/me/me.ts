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
  bindCodeSchema,
  favoriteSchema,
  favoritesSchema,
  goalSchema,
  goalsSchema,
  linkedAccountsSchema,
  modDevicesSchema,
  notificationSettingsSchema
} from '@bronevik/schemas';

import { api } from '../http';
import { fromSource } from '../source';
import { mockMe } from './me.mock';

const WITH_SESSION = { withCredentials: true } as const;

export const getFavorites = (): Promise<Favorite[]> =>
  fromSource({ mock: mockMe.favorites, fetch: async () => favoritesSchema.parse((await api.get('/me/favorites', WITH_SESSION)).data) });

export const addFavorite = (input: CreateFavoriteInput): Promise<Favorite> =>
  fromSource({
    mock: () => mockMe.addFavorite(input),
    fetch: async () => favoriteSchema.parse((await api.post('/me/favorites', input, WITH_SESSION)).data)
  });

export const removeFavorite = (id: string): Promise<void> =>
  fromSource({
    mock: () => mockMe.removeFavorite(id),
    fetch: async () => {
      await api.delete(`/me/favorites/${id}`, WITH_SESSION);
    }
  });

export const getGoals = (): Promise<Goal[]> =>
  fromSource({ mock: mockMe.goals, fetch: async () => goalsSchema.parse((await api.get('/me/goals', WITH_SESSION)).data) });

export const addGoal = (input: CreateGoalInput): Promise<Goal> =>
  fromSource({
    mock: () => mockMe.addGoal(input),
    fetch: async () => goalSchema.parse((await api.post('/me/goals', input, WITH_SESSION)).data)
  });

export const removeGoal = (id: string): Promise<void> =>
  fromSource({
    mock: () => mockMe.removeGoal(id),
    fetch: async () => {
      await api.delete(`/me/goals/${id}`, WITH_SESSION);
    }
  });

export const getNotificationSettings = (): Promise<NotificationSettings> =>
  fromSource({
    mock: mockMe.notifications,
    fetch: async () => notificationSettingsSchema.parse((await api.get('/me/notifications', WITH_SESSION)).data)
  });

export const updateNotificationSettings = (patch: Partial<NotificationSettings>): Promise<NotificationSettings> =>
  fromSource({
    mock: () => mockMe.updateNotifications(patch),
    fetch: async () => notificationSettingsSchema.parse((await api.patch('/me/notifications', patch, WITH_SESSION)).data)
  });

export const getLinkedAccounts = (): Promise<LinkedAccounts> =>
  fromSource({ mock: mockMe.accounts, fetch: async () => linkedAccountsSchema.parse((await api.get('/me/accounts', WITH_SESSION)).data) });

export const issueBindCode = (accountId?: number): Promise<BindCode> =>
  fromSource({
    mock: mockMe.bindCode,
    fetch: async () => bindCodeSchema.parse((await api.post('/mod/bind-code', { accountId }, WITH_SESSION)).data)
  });

export const getModDevices = (): Promise<ModDevice[]> =>
  fromSource({ mock: mockMe.devices, fetch: async () => modDevicesSchema.parse((await api.get('/mod/devices', WITH_SESSION)).data) });

export const revokeModDevice = (id: string): Promise<void> =>
  fromSource({
    mock: () => mockMe.revokeDevice(id),
    fetch: async () => {
      await api.delete(`/mod/devices/${encodeURIComponent(id)}`, WITH_SESSION);
    }
  });
