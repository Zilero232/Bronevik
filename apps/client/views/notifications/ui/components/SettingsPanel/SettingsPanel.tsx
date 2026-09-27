'use client';

import { useTranslations } from 'next-intl';

import { QueryState, Skeleton } from '@/ui-kit';

import { useSettingsPanel } from '../../../model/hooks';
import { ChannelsSection } from '../ChannelsSection';
import { EventsSection } from '../EventsSection';
import { QuietHoursSection } from '../QuietHoursSection';
import { ReportsSection } from '../ReportsSection';

import s from './SettingsPanel.module.scss';

export const SettingsPanel = () => {
  const t = useTranslations('notifications.settings');
  const { query, onPatch } = useSettingsPanel();

  return (
    <QueryState
      skeleton={
        <div aria-busy className={s.skeleton}>
          <Skeleton height={220} shape='block' />
          <Skeleton height={320} shape='block' />
        </div>
      }
      errorTitle={t('error')}
      query={query}
    >
      {(loaded) => (
        <>
          <ChannelsSection settings={loaded} onPatch={onPatch} />
          <QuietHoursSection settings={loaded} onPatch={onPatch} />
          <EventsSection settings={loaded} onPatch={onPatch} />
          <ReportsSection settings={loaded} onPatch={onPatch} />
        </>
      )}
    </QueryState>
  );
};
