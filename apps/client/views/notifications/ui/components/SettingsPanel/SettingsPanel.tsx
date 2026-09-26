'use client';

import type { NotificationSettings } from '@otmetki/schemas';

import { useTranslations } from 'next-intl';
import { match, P } from 'ts-pattern';

import { ErrorState, Skeleton } from '@/ui-kit';

import { useNotificationSettings } from '../../../model/hooks';
import { ChannelsSection } from '../ChannelsSection';
import { EventsSection } from '../EventsSection';
import { QuietHoursSection } from '../QuietHoursSection';
import { ReportsSection } from '../ReportsSection';

import s from './SettingsPanel.module.scss';

export const SettingsPanel = () => {
  const t = useTranslations('notifications.settings');
  const { settings, isPending, isFetching, refetch, save } = useNotificationSettings();

  const onPatch = (patch: Partial<NotificationSettings>) => save.mutate(patch);

  return match({ settings, isPending })
    .with({ settings: P.nonNullable }, ({ settings: loaded }) => (
      <>
        <ChannelsSection settings={loaded} onPatch={onPatch} />
        <QuietHoursSection settings={loaded} onPatch={onPatch} />
        <EventsSection settings={loaded} onPatch={onPatch} />
        <ReportsSection settings={loaded} onPatch={onPatch} />
      </>
    ))
    .with({ isPending: true }, () => (
      <div aria-busy className={s.skeleton}>
        <Skeleton height={220} shape='block' />
        <Skeleton height={320} shape='block' />
      </div>
    ))
    .otherwise(() => <ErrorState isRetrying={isFetching} title={t('error')} onRetry={() => void refetch()} />);
};
