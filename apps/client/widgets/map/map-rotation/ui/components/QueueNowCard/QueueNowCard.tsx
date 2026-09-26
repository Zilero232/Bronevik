'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Card, CardHeader, DeltaValue, EmptyState, ErrorState, KeyFigure, Skeleton } from '@/ui-kit';

import type { QueueNowCardProps } from './QueueNowCard.types';

import { useQueueNow } from '../../../model/hooks';
import { TierMark } from '../TierMark';

import s from './QueueNowCard.module.scss';

export const QueueNowCard = ({ className }: QueueNowCardProps) => {
  const t = useTranslations('mapStats.now');
  const format = useFormatter();
  const view = useQueueNow();

  return (
    <Card className={className} padding='none'>
      <CardHeader
        action={
          <Link className={s.more} href={ROUTES.maps.rotation}>
            {t('more')}
          </Link>
        }
        meta={view.now && view.timezone ? t('meta', { hour: view.now.hour, timezone: view.timezone }) : undefined}
        title={t('title')}
      />
      {view.isError && (
        <ErrorState isCompact description={t('errorDescription')} isRetrying={view.isRetrying} title={t('errorTitle')} onRetry={view.retry} />
      )}
      {view.isPending && <Skeleton className={s.skeleton} height={160} shape='block' />}
      {view.isEmpty && <EmptyState isCompact description={t('emptyDescription')} title={t('empty')} />}
      {!view.isPending && !view.isError && !view.isEmpty && (
        <div className={s.body}>
          <div className={s.summary}>
            <KeyFigure
              hint={view.now?.fastest ? t('fastest', { hour: view.now.fastest.hour, wait: view.formatWait(view.now.fastest.medianSec) }) : undefined}
              label={t('overall')}
              size='lg'
              value={view.overall ? view.formatWait(view.overall.medianSec) : null}
            />
            {view.tiers.length > 0 && (
              <ul className={s.tiers}>
                {view.tiers.map((cell) => (
                  <li key={cell.tier} className={s.tier}>
                    <TierMark tier={cell.tier} />
                    <span className={s.wait}>{view.formatWait(cell.medianSec)}</span>
                    {cell.deltaSec !== null && (
                      <DeltaValue isLowerBetter format={{ maximumFractionDigits: 0 }} suffix={t('secondsSuffix')} value={cell.deltaSec} />
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {view.topMaps.length > 0 && (
            <div className={s.maps}>
              <span className={s.label}>{t('topMaps')}</span>
              <ol className={s.mapList}>
                {view.topMaps.map((row) => (
                  <li key={row.arenaId} className={s.map}>
                    {row.slug ? (
                      <Link className={s.mapLink} href={ROUTES.maps.detail(row.slug)}>
                        {row.name}
                      </Link>
                    ) : (
                      <span>{row.name}</span>
                    )}
                    <span className={s.share}>{format.number(row.share / 100, { style: 'percent', maximumFractionDigits: 1 })}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
