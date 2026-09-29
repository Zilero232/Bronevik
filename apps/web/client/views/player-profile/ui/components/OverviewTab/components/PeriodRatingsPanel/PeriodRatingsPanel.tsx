'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { RatingsMethodLink, RatingValue } from '@/entities/player/stats';
import { WinRateCell } from '@/entities/tank/tank';
import { EmptyState } from '@/ui-kit';

import { usePeriodRatings } from '../../../../../model/hooks';
import { ProfilePanel } from '../../../ProfilePanel';

import s from './PeriodRatingsPanel.module.scss';

export const PeriodRatingsPanel = () => {
  const t = useTranslations('profile.overview');
  const tCommon = useTranslations('common');
  const format = useFormatter();
  const rows = usePeriodRatings();

  return (
    <ProfilePanel isFlush action={<RatingsMethodLink section='scale' />} title={t('periodsTitle')}>
      {rows.length === 0 ? (
        <EmptyState isCompact title={t('periodsEmpty')} />
      ) : (
        <div className={s.scroller}>
          <table className={s.table}>
            <thead>
              <tr>
                <th scope='col'>{t('period')}</th>
                <th scope='col'>{t('battles')}</th>
                <th scope='col'>{t('winRate')}</th>
                <th scope='col'>{tCommon('ratings.wn8')}</th>
                <th scope='col'>{t('broneIndex')}</th>
                <th scope='col'>{t('avgDamage')}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ period, label, stats }) => (
                <tr key={period}>
                  <th scope='row'>{label}</th>
                  <td>{format.number(stats.battles)}</td>
                  <td>
                    <WinRateCell value={stats.winRate} />
                  </td>
                  <td>
                    <RatingValue rating={stats.wn8} />
                  </td>
                  <td>
                    <RatingValue rating={stats.broneIndex} />
                  </td>
                  <td>{stats.avgDamage === null ? '—' : format.number(stats.avgDamage, { maximumFractionDigits: 0 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </ProfilePanel>
  );
};
