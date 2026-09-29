'use client';

import { useTranslations } from 'next-intl';

import { EventAlert } from '@/widgets/notifications/event-alert';

import { CHECKOUT_NOTIFY } from '../../../../../config';

export const CheckoutNotify = () => {
  const t = useTranslations('plus.checkout.notify');

  return (
    <EventAlert
      channels={t('channels')}
      event={CHECKOUT_NOTIFY.event}
      label={t('label')}
      messages={{ enabled: t('enabled'), disabled: t('disabled'), failed: t('failed') }}
      skeleton={CHECKOUT_NOTIFY.skeleton}
    />
  );
};
