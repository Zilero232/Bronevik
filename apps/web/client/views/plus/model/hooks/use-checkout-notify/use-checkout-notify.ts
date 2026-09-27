'use client';

import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { toggleEvent, useNotificationSettings } from '@/features/notifications/notification-settings';

import { CHECKOUT_NOTIFY } from '../../../config';

export const useCheckoutNotify = () => {
  const t = useTranslations('plus.checkout.notify');
  const { settings, isPending, onPatch } = useNotificationSettings({
    onSuccess: (next) => toast.success(next.events.includes(CHECKOUT_NOTIFY.event) ? t('enabled') : t('disabled')),
    onError: () => toast.error(t('failed'))
  });

  return {
    isOn: settings?.events.includes(CHECKOUT_NOTIFY.event) ?? false,
    isPending,
    onToggle: (isOn: boolean) => settings && onPatch({ events: toggleEvent({ events: settings.events, event: CHECKOUT_NOTIFY.event, isOn }) })
  };
};
