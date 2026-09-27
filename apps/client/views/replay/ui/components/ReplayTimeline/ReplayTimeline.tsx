'use client';

import { useTranslations } from 'next-intl';
import { useId } from 'react';

import { Card, CardBody, CardHeader, EmptyState, LineChart } from '@/ui-kit';

import { BATTLE_TIMELINE } from '../../../config';
import { useBattleTimeline } from '../../../model/hooks';

import s from './ReplayTimeline.module.scss';

export const ReplayTimeline = () => {
  const t = useTranslations('replays.timeline');
  const titleId = useId();
  const { hasData, labels, series, yDomain, kills, formatValue } = useBattleTimeline();

  return (
    <Card aria-labelledby={titleId} padding='none'>
      <CardHeader meta={t('meta')} title={<span id={titleId}>{t('title')}</span>} />
      <CardBody className={s.body}>
        {hasData ? (
          <>
            <LineChart
              ariaLabel={t('chartLabel')}
              formatValue={formatValue}
              height={BATTLE_TIMELINE.chartHeight}
              labels={labels}
              series={series}
              yDomain={yDomain}
            />
            {kills.length > 0 && (
              <ol aria-label={t('killsLabel')} className={s.kills}>
                {kills.map((kill) => (
                  <li key={kill.id} className={s.kill} data-side={kill.isAllyLoss ? 'ally' : 'enemy'}>
                    <span className={s.time}>{kill.time}</span>
                    <span className={s.text}>
                      {kill.killer ? t('killedBy', { victim: kill.victim, killer: kill.killer }) : t('destroyed', { victim: kill.victim })}
                    </span>
                  </li>
                ))}
              </ol>
            )}
            <p className={s.note}>{t('note')}</p>
          </>
        ) : (
          <EmptyState isCompact description={t('emptyDescription')} title={t('emptyTitle')} />
        )}
      </CardBody>
    </Card>
  );
};
