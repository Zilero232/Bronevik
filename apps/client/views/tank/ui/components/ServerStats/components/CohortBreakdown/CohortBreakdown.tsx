'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { ratingTone } from '@/shared/lib';
import { Card, CardHeader } from '@/ui-kit';

import { cohortBreakdown } from '../../../../../lib';
import { useTank } from '../../../../../model/context';
import { SectionNotice } from '../../../SectionNotice';
import { CohortBar } from '../CohortBar';

import s from './CohortBreakdown.module.scss';

export const CohortBreakdown = () => {
  const t = useTranslations('tank.stats');
  const format = useFormatter();
  const { detail } = useTank();

  const bars = cohortBreakdown(detail.serverStats);

  return (
    <Card className={s.root} padding='lg'>
      <CardHeader eyebrow={t('cohortsEyebrow')} title={t('cohortsTitle')} />
      {bars.length === 0 && <SectionNotice kind='empty' />}
      <ul className={s.list}>
        {bars.map(({ cohort, winRate, avgDamage, winRateShare, damageShare }, index) => (
          <li key={cohort} className={s.row}>
            <span className={s.name}>
              <span className={s.step}>{`0${index + 1}`}</span>
              {t(`cohorts.${cohort}`)}
            </span>
            <CohortBar
              label={t('cohortWinRate')}
              share={winRateShare}
              tone={ratingTone({ scale: 'winRate', value: winRate })}
              value={`${format.number(winRate, { maximumFractionDigits: 1 })}%`}
            />
            <CohortBar label={t('cohortDamage')} share={damageShare} tone='accent' value={format.number(avgDamage, { maximumFractionDigits: 0 })} />
          </li>
        ))}
      </ul>
    </Card>
  );
};
