'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { TankLink } from '@/entities/tank/tank';
import { EmptyState, QueryState, Skeleton } from '@/ui-kit';

import { CAREER } from '../../../../../config';
import { useCareerPanel } from '../../../../../model/hooks';
import { ProfilePanel } from '../../../ProfilePanel';

import s from './CareerPanel.module.scss';

export const CareerPanel = () => {
  const t = useTranslations('profile.career');
  const format = useFormatter();
  const { query, records, assist, assistParts, isEmpty } = useCareerPanel();

  return (
    <ProfilePanel title={t('title')}>
      <QueryState
        isCompact
        empty={<EmptyState isCompact title={t('empty')} />}
        isEmpty={() => isEmpty}
        query={query}
        skeleton={<Skeleton height={CAREER.skeletonHeight} shape='block' />}
      >
        <div className={s.root}>
          <ul className={s.records}>
            {records.map(({ key, value, vehicle, achievedAt }) => (
              <li key={key} className={s.record}>
                <span className={s.label}>{t(`records.${key}`)}</span>
                <span className={s.value}>{format.number(value)}</span>
                {vehicle && <TankLink image='contour' vehicle={vehicle} />}
                {achievedAt && (
                  <span className={s.meta}>
                    {t('since', { date: format.dateTime(new Date(achievedAt), { day: 'numeric', month: 'short', year: 'numeric' }) })}
                  </span>
                )}
              </li>
            ))}
          </ul>
          {assist && (
            <div className={s.assist}>
              <span className={s.label}>{t('assist.title')}</span>
              <span className={s.value}>{assist.avgAssisted === null ? '—' : format.number(assist.avgAssisted, { maximumFractionDigits: 0 })}</span>
              <ul className={s.parts}>
                {assistParts.map(({ key, value }) => (
                  <li key={key}>{t(`assist.${key}`, { value: format.number(value, { maximumFractionDigits: 0 }) })}</li>
                ))}
              </ul>
              <p className={s.note}>{t('assist.note')}</p>
            </div>
          )}
        </div>
      </QueryState>
    </ProfilePanel>
  );
};
