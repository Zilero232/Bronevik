'use client';

import { useTranslations } from 'next-intl';

import { EmptyState, QueryState, Select, Skeleton } from '@/ui-kit';

import type { MoeCurveProps } from './MoeCurve.types';

import { MOE_LIST } from '../../../../../config';
import { useMoeCurve } from '../../../../../model/hooks';

import s from './MoeCurve.module.scss';

export const MoeCurve = ({ tankId }: MoeCurveProps) => {
  const t = useTranslations('marks.drawer.curve');
  const { query, items, value, rows, result, note, onPercentChange } = useMoeCurve(tankId);

  return (
    <QueryState
      empty={<EmptyState isCompact description={t('emptyDescription')} title={t('emptyTitle')} />}
      isEmpty={({ entries }) => entries.length === 0}
      query={query}
      skeleton={<Skeleton height={MOE_LIST.historyChartHeight} width='100%' />}
    >
      <div className={s.root}>
        <div className={s.calculator}>
          {value !== null && <Select className={s.select} items={items} label={t('target')} value={value} onValueChange={onPercentChange} />}
          {result && (
            <div className={s.result}>
              <span className={s.damage}>{result.damage}</span>
              <span className={s.caption}>{t('damageCaption')}</span>
              <span className={s.caption}>{result.note}</span>
            </div>
          )}
        </div>
        <dl className={s.steps}>
          {rows.map((row) => (
            <div key={row.key} className={s.step} data-selected={row.isSelected}>
              <dt className={s.percent}>{row.percent}</dt>
              <dd className={s.value}>{row.damage}</dd>
              <dd className={s.source}>{row.source}</dd>
            </div>
          ))}
        </dl>
        <p className={s.note}>{note}</p>
      </div>
    </QueryState>
  );
};
