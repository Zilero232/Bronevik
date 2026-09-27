'use client';

import { useTranslations } from 'next-intl';

import { Card, CardHeader, EmptyState } from '@/ui-kit';

import { useCohortBreakdown } from '../../../../../model/hooks';

import s from './CohortBreakdown.module.scss';

export const CohortBreakdown = () => {
  const t = useTranslations('tank.stats');
  const { lines } = useCohortBreakdown();

  return (
    <Card padding='none'>
      <CardHeader className={s.header} title={t('cohortsTitle')} />
      {lines.length === 0 ? (
        <EmptyState title={t('emptyTitle')} />
      ) : (
        <table className={s.table}>
          <thead>
            <tr>
              <th scope='col'>{t('cohortLabel')}</th>
              <th scope='col'>{t('cohortWinRate')}</th>
              <th scope='col'>{t('cohortDamage')}</th>
              <th scope='col'>{t('cohortBattles')}</th>
            </tr>
          </thead>
          <tbody>
            {lines.map(({ cohort, label, winRate, tone, avgDamage, battles, damageShare }) => (
              <tr key={cohort}>
                <th scope='row'>{label}</th>
                <td className={s.rated} data-tone={tone}>
                  {winRate}
                </td>
                <td>
                  <span className={s.damage}>
                    {avgDamage}
                    <span aria-hidden className={s.track}>
                      <span className={s.bar} style={{ width: `${damageShare * 100}%` }} />
                    </span>
                  </span>
                </td>
                <td>{battles}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  );
};
