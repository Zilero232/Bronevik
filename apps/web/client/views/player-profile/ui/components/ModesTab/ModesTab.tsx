'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { TankLink, WinRateCell } from '@/entities/tank/tank';
import { percentText } from '@/shared/lib';
import { EmptyState, QueryState, Skeleton } from '@/ui-kit';

import { MODES_TAB } from '../../../config';
import { useModesTab } from '../../../model/hooks';
import { ProfilePanel } from '../ProfilePanel';

import s from './ModesTab.module.scss';

export const ModesTab = () => {
  const t = useTranslations('profile.modes');
  const format = useFormatter();
  const { query, source } = useModesTab();

  return (
    <QueryState
      empty={<EmptyState description={t('emptyText')} title={t('emptyTitle')} />}
      isEmpty={(data) => data.modes.length === 0}
      query={query}
      skeleton={<Skeleton height={MODES_TAB.skeletonHeight} shape='block' />}
    >
      {({ modes }) => (
        <div className={s.root}>
          {source === 'live' && <p className={s.note}>{t('liveNote')}</p>}
          {modes.map((line) => (
            <ProfilePanel isFlush key={line.mode} meta={t('battles', { count: line.battles })} title={t(`names.${line.mode}`)}>
              <dl className={s.figures}>
                <div>
                  <dt>{t('winRate')}</dt>
                  <dd>
                    <WinRateCell value={line.winRate} />
                  </dd>
                </div>
                <div>
                  <dt>{t('avgDamage')}</dt>
                  <dd>{line.avgDamage === null ? '—' : format.number(line.avgDamage, { maximumFractionDigits: 0 })}</dd>
                </div>
                <div>
                  <dt>{t('avgFrags')}</dt>
                  <dd>{line.avgFrags === null ? '—' : format.number(line.avgFrags, { maximumFractionDigits: 2 })}</dd>
                </div>
                <div>
                  <dt>{t('survivalRate')}</dt>
                  <dd>{percentText({ format, value: line.survivalRate })}</dd>
                </div>
                <div>
                  <dt>{t('maxDamage')}</dt>
                  <dd>{line.maxDamage === null ? '—' : format.number(line.maxDamage)}</dd>
                </div>
              </dl>
              {line.tanks.length > 0 && (
                <ol className={s.tanks}>
                  {line.tanks.map((tank) => (
                    <li key={tank.vehicle.tankId} className={s.tank}>
                      <TankLink image='contour' vehicle={tank.vehicle} />
                      <span className={s.meta}>{t('battles', { count: tank.battles })}</span>
                      <WinRateCell value={tank.winRate} />
                      <span className={s.meta}>{tank.avgDamage === null ? '—' : format.number(tank.avgDamage, { maximumFractionDigits: 0 })}</span>
                    </li>
                  ))}
                </ol>
              )}
            </ProfilePanel>
          ))}
        </div>
      )}
    </QueryState>
  );
};
