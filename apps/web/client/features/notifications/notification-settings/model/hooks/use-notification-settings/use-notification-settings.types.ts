import type { NotificationSettings } from '@otmetki/schemas';
import type { UseMutationOptions } from '@tanstack/react-query';

export type UseNotificationSettingsInput = Pick<
  UseMutationOptions<NotificationSettings, Error, Partial<NotificationSettings>>,
  'onError' | 'onSuccess'
>;
