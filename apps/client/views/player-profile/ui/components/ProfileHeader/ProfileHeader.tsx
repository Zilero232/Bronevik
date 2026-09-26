'use client';

import type { RatingPeriod } from '@otmetki/schemas';

import { useTranslations } from 'next-intl';

import { RelativeTime, SegmentedControl } from '@/ui-kit';

import { useProfileHeader } from '../../../model/hooks';
import { HeaderActions, HeaderFigures, HeaderIdentity } from './components';

import s from './ProfileHeader.module.scss';

export const ProfileHeader = () => {
  const t = useTranslations('profile.header');
  const { summary, stats, hasPeriodData, period, setPeriod, periodOptions } = useProfileHeader();

  return (
    <section className={s.root}>
      <div className={s.top}>
        <div className={s.identity}>
          <HeaderIdentity summary={summary} />
          <HeaderActions accountId={summary.accountId} />
        </div>
        <HeaderFigures stats={stats} />
      </div>
      <div className={s.bottom}>
        <SegmentedControl<RatingPeriod> aria-label={t('period')} options={periodOptions} size='sm' value={period} onChange={setPeriod} />
        {!hasPeriodData && <span className={s.note}>{t('noPeriodData')}</span>}
        <span className={s.updated}>
          {t('updated')} <RelativeTime value={summary.updatedAt} />
        </span>
      </div>
    </section>
  );
};
