import { entries, invert } from 'remeda';

import type {
  ClanRole as DbClanRole,
  NotificationChannel as DbNotificationChannel,
  NotificationEvent as DbNotificationEvent
} from '../../../../generated';

import { CLAN_ROLE_FROM_DB, NOTIFICATION_CHANNEL_FROM_DB, NOTIFICATION_EVENT_FROM_DB } from './enums.constants';

const clanRoles = new Map<string, DbClanRole>(entries(invert(CLAN_ROLE_FROM_DB)));
const notificationEvents = new Map<string, DbNotificationEvent>(entries(invert(NOTIFICATION_EVENT_FROM_DB)));
const notificationChannels = new Map<string, DbNotificationChannel>(entries(invert(NOTIFICATION_CHANNEL_FROM_DB)));

export const clanRoleToDb = (role: string): DbClanRole | null => clanRoles.get(role) ?? null;

export const notificationEventToDb = (event: string): DbNotificationEvent | null => notificationEvents.get(event) ?? null;

export const notificationChannelToDb = (channel: string): DbNotificationChannel | null => notificationChannels.get(channel) ?? null;
