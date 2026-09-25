'use client';

import type { RatingPeriod } from '@bronevik/schemas';

import { useFormatter, useNow, useTranslations } from 'next-intl';

import { SegmentedControl } from '@/ui-kit';

import { PROFILE_PERIODS } from '../../../../../config';
import { useProfileContext } from '../../../../../model/context';

import s from './HeroPeriod.module.scss';

export const HeroPeriod = () => {
  const t = useTranslations('profile');
  const tPeriods = useTranslations('periods');
  const format = useFormatter();
  const now = useNow({ updateInterval: 60_000 });
  const { profile, period, setPeriod } = useProfileContext();

  const { updatedAt } = profile.summary;
  const options = PROFILE_PERIODS.map((value) => ({ value, label: value === 'overall' ? t('overall') : tPeriods(value) }));

  return (
    <>
      <div className={s.control}>
        <span className={s.label}>{tPeriods('label')}</span>
        <SegmentedControl<RatingPeriod> aria-label={tPeriods('label')} options={options} size='sm' value={period} onChange={setPeriod} />
      </div>
      <span className={s.updated}>{t('hero.updated', { time: format.relativeTime(new Date(updatedAt), now) })}</span>
    </>
  );
};
