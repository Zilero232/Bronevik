import { QUERY_KEYS } from '@/shared/constants';

export const NOTIFICATION_SETTINGS = {
  queryKey: QUERY_KEYS.me.section('notifications'),
  mutationKey: [...QUERY_KEYS.me.section('notifications'), 'patch']
} as const;
