import type { NotificationSettings } from '@otmetki/schemas';

import { meControllerNotificationSettings, meControllerUpdateNotificationSettings } from '@/shared/api/generated';
import { SESSION_REQUEST } from '@/shared/api/http';
import { fromSdk } from '@/shared/api/source';

export const getNotificationSettings = (): Promise<NotificationSettings> => fromSdk(() => meControllerNotificationSettings(SESSION_REQUEST));

export const updateNotificationSettings = (patch: Partial<NotificationSettings>): Promise<NotificationSettings> =>
  fromSdk(() => meControllerUpdateNotificationSettings({ ...SESSION_REQUEST, body: patch }));
