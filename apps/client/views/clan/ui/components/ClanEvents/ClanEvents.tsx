'use client';

import { useTranslations } from 'next-intl';

import { SectionHeader } from '@/ui-kit';

import type { ClanEventsProps } from './ClanEvents.types';

import { EventTimeline, MovesChart } from './components';

import s from './ClanEvents.module.scss';

export const ClanEvents = ({ clanId, now }: ClanEventsProps) => {
  const t = useTranslations('clans.events');

  return (
    <section>
      <SectionHeader description={t('description')} eyebrow={t('eyebrow')} index='// 02' title={t('title')} />
      <div className={s.grid}>
        <EventTimeline clanId={clanId} />
        <MovesChart clanId={clanId} now={now} />
      </div>
    </section>
  );
};
