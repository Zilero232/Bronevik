'use client';

import type { OfficialRatingField } from '@otmetki/schemas';

import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';

import { Link } from '@/shared/i18n/navigation';
import { Card, CardHeader, DeltaValue, EmptyState, QueryState, SegmentedControl, Select, Skeleton, Sparkline } from '@/ui-kit';

import { HALL_OF_FAME } from '../../../config';
import { useHallOfFame } from '../../../model/hooks';

import s from './HallOfFame.module.scss';

export const HallOfFame = () => {
  const t = useTranslations('top.hall');
  const {
    period,
    field,
    periodOptions,
    fieldItems,
    valueText,
    top,
    topItems,
    neighbors,
    rankTrend,
    latestRank,
    isSignedIn,
    onPeriodChange,
    onFieldChange
  } = useHallOfFame();

  return (
    <Card padding='none'>
      <CardHeader className={s.header} meta={t('source')} title={t('title')} />
      <div className={s.body}>
        <div className={s.controls}>
          <SegmentedControl aria-label={t('periodLabel')} options={periodOptions} size='sm' value={period} variant='text' onChange={onPeriodChange} />
          <Select<OfficialRatingField> aria-label={t('fieldLabel')} items={fieldItems} value={field} onValueChange={onFieldChange} />
        </div>
        <div className={s.columns}>
          <QueryState
            isCompact
            empty={<EmptyState isCompact title={t('empty')} />}
            isEmpty={() => topItems.length === 0}
            query={top}
            skeleton={<Skeleton height={HALL_OF_FAME.skeletonHeight} shape='block' />}
          >
            <ol className={s.list}>
              {topItems.map(({ accountId, rank, rankDelta, value, clanTag, link }) => (
                <li key={accountId} className={s.row}>
                  <span className={s.rank}>{rank ?? '—'}</span>
                  <Link className={s.name} href={link.href}>
                    {clanTag && <span className={s.clan}>[{clanTag}]</span>}
                    {link.label}
                  </Link>
                  <span className={s.value}>{valueText(value)}</span>
                  {rankDelta !== null && <DeltaValue value={rankDelta} />}
                </li>
              ))}
            </ol>
          </QueryState>
          <section aria-label={t('aroundTitle')} className={s.around}>
            <h3 className={s.subtitle}>{t('aroundTitle')}</h3>
            {!isSignedIn && <p className={s.note}>{t('signInHint')}</p>}
            {isSignedIn && neighbors.length === 0 && <p className={s.note}>{t('notRanked')}</p>}
            {neighbors.length > 0 && (
              <ol className={s.list}>
                {neighbors.map(({ accountId, rank, value, link, isViewer }) => (
                  <li key={accountId} className={clsx(s.row, isViewer && s.viewer)}>
                    <span className={s.rank}>{rank ?? '—'}</span>
                    <Link className={s.name} href={link.href}>
                      {link.label}
                    </Link>
                    <span className={s.value}>{valueText(value)}</span>
                  </li>
                ))}
              </ol>
            )}
            {rankTrend.length > 1 && (
              <div className={s.trend}>
                <span className={s.note}>{t('trend', { days: rankTrend.length, rank: latestRank ?? 0 })}</span>
                <Sparkline data={rankTrend} height={HALL_OF_FAME.sparkline.height} label={t('trendLabel')} width={HALL_OF_FAME.sparkline.width} />
              </div>
            )}
          </section>
        </div>
      </div>
    </Card>
  );
};
