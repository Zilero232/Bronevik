'use client';

import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { toggleEvent, useNotificationSettings } from '@/features/notifications/notification-settings';

import { CODE_ALERT } from '../../../config';

export const useCodeAlert = () => {
  const t = useTranslations('codes.alert');
  const { settings, isSignedIn, isPending, onPatch } = useNotificationSettings({
    onSuccess: (next) => toast.success(next.events.includes(CODE_ALERT.event) ? t('enabled') : t('disabled')),
    onError: () => toast.error(t('failed'))
  });

  return {
    isSignedIn,
    isOn: settings?.events.includes(CODE_ALERT.event) ?? false,
    isPending,
    onToggle: (isOn: boolean) => settings && onPatch({ events: toggleEvent({ events: settings.events, event: CODE_ALERT.event, isOn }) })
  };
};
