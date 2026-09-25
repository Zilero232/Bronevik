'use client';

import { Clock3 } from 'lucide-react';
import { useFormatter, useLocale, useTranslations } from 'next-intl';

import { Badge, Skeleton } from '@/ui-kit';

import { playtimeSummary } from '../../../../../lib/playtime-summary';
import { usePlayerPlaytime } from '../../../../../model/hooks';
import { TabCard } from '../../../TabCard';
import { TabState } from '../../../TabState';
import { PlaytimeGrid } from '../PlaytimeGrid';

import s from './PlaytimeCard.module.scss';

const MIN_SLOT_BATTLES = 30;

export const PlaytimeCard = () => {
  const t = useTranslations('profile.insights.playtime');
  const format = useFormatter();
  const locale = useLocale();
  const { data: playtime, isPending, isError } = usePlayerPlaytime();

  const hasData = playtime !== undefined && playtime.source !== 'none' && playtime.battles > 0;
  const summary = playtime && hasData ? playtimeSummary({ cells: playtime.cells, minBattles: MIN_SLOT_BATTLES }) : null;
  const weekday = (index: number) =>
    new Intl.DateTimeFormat(locale, { weekday: 'long', timeZone: 'UTC' }).format(new Date(Date.UTC(2024, 0, 1 + index)));

  const rate = (value: number) => format.number(value, { maximumFractionDigits: 1 });

  return (
    <TabCard action={<Badge tone='steel'>{t('beta')}</Badge>} eyebrow={t('eyebrow')} title={t('title')}>
      {isError && <TabState kind='error' />}
      {isPending && <Skeleton height={260} shape='block' />}
      {playtime && !hasData && <TabState kind='empty' />}
      {playtime && summary && (
        <div className={s.root}>
          {playtime.source === 'snapshots' && <p className={s.note}>{t('approximate')}</p>}
          <div className={s.callouts}>
            {summary.bestHour && (
              <p className={s.callout} data-kind='best'>
                <Clock3 size={16} />
                {t('bestHour', { from: summary.bestHour.key, to: (summary.bestHour.key + 1) % 24, rate: rate(summary.bestHour.winRate) })}
              </p>
            )}
            {summary.worstHour && (
              <p className={s.callout} data-kind='worst'>
                <Clock3 size={16} />
                {t('worstHour', { from: summary.worstHour.key, to: (summary.worstHour.key + 1) % 24, rate: rate(summary.worstHour.winRate) })}
              </p>
            )}
            {summary.bestWeekday && (
              <p className={s.callout}>{t('bestWeekday', { day: weekday(summary.bestWeekday.key), rate: rate(summary.bestWeekday.winRate) })}</p>
            )}
          </div>
          <PlaytimeGrid cells={playtime.cells} weekdayLabel={(index) => weekday(index).slice(0, 2)} />
        </div>
      )}
    </TabCard>
  );
};
