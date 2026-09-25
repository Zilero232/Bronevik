'use client';

import { BellOff, BellRing } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/ui-kit';

import { usePushSubscription } from '../../../model/hooks';
import { SettingsCard } from '../SettingsCard';

import s from './PushCard.module.scss';

export const PushCard = () => {
  const t = useTranslations('notifications.push');
  const { status, isMock, subscribe, unsubscribe } = usePushSubscription();

  return (
    <SettingsCard className={s.root} description={t('description')} eyebrow={t('eyebrow')} icon={<BellRing size={18} />} title={t('title')}>
      <div className={s.status} data-status={status}>
        <span aria-hidden className={s.led} />
        <span className={s.label}>{t(`status.${status}`)}</span>
      </div>
      <p className={s.hint}>{t(`hint.${status}`)}</p>
      {status === 'idle' && (
        <Button disabled={subscribe.isPending} onClick={() => subscribe.mutate()}>
          <BellRing size={16} />
          {t('subscribe')}
        </Button>
      )}
      {status === 'subscribed' && (
        <Button disabled={unsubscribe.isPending} variant='secondary' onClick={() => unsubscribe.mutate()}>
          <BellOff size={16} />
          {t('unsubscribe')}
        </Button>
      )}
      {isMock && <p className={s.mock}>{t('mock')}</p>}
    </SettingsCard>
  );
};
