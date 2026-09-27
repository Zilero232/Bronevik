'use client';

import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useNotificationSettings } from '@/features/notifications/notification-settings';

export const useSettingsPanel = () => {
  const t = useTranslations('notifications.settings');
  const { query, onPatch } = useNotificationSettings({ onError: () => toast.error(t('failed')) });

  return { query, onPatch };
};
