'use client';

import { Crown } from 'lucide-react';
import { motion } from 'motion/react';
import { useFormatter, useTranslations } from 'next-intl';

import { periodStats } from '@/entities/player/stats';
import { ROW_ITEM } from '@/shared/lib';

import type { CompareFormat } from '../../../config';
import type { CompareTableProps } from './CompareTable.types';

import { COMPARE_METRICS } from '../../../config';
import { bestIndices } from '../../../lib/compare-math';

import s from './CompareTable.module.scss';

const FORMATS: Record<CompareFormat, Intl.NumberFormatOptions> = {
  integer: { maximumFractionDigits: 0 },
  decimal: { maximumFractionDigits: 2, minimumFractionDigits: 2 },
  percent: { maximumFractionDigits: 2, minimumFractionDigits: 2 }
};

export const CompareTable = ({ comparison, period }: CompareTableProps) => {
  const t = useTranslations('compare.metrics');
  const tCompare = useTranslations('compare');
  const format = useFormatter();

  const { players } = comparison;
  const columns = players.map(({ summary, recent }) => ({ summary, stats: periodStats({ overall: summary.overall, recent, period }) }));

  return (
    <div className={s.scroller}>
      <table className={s.table}>
        <caption className={s.caption}>{tCompare('caption')}</caption>
        <thead>
          <tr>
            <th scope='col'>{tCompare('metric')}</th>
            {columns.map(({ summary }, index) => (
              <th key={summary.accountId} data-slot={index} scope='col'>
                {summary.nickname}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {COMPARE_METRICS.map((metric, rowIndex) => {
            const values = columns.map((column) => metric.pick(column));
            const best = bestIndices({ values, direction: metric.direction });
            const max = Math.max(1, ...values.map((value) => Math.abs(value ?? 0)));

            return (
              <motion.tr key={metric.key} animate='visible' custom={rowIndex} initial='hidden' variants={ROW_ITEM}>
                <th scope='row'>{t(metric.key)}</th>
                {values.map((value, index) => (
                  <td key={columns[index].summary.accountId} data-best={best.includes(index)} data-slot={index}>
                    <span className={s.value}>
                      {best.includes(index) && <Crown aria-label={tCompare('best')} className={s.crown} size={14} />}
                      {value === null ? '—' : `${format.number(value, FORMATS[metric.format])}${metric.format === 'percent' ? '%' : ''}`}
                    </span>
                    <span aria-hidden className={s.bar} style={{ '--fill': `${((value ?? 0) / max) * 100}%` }} />
                  </td>
                ))}
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
