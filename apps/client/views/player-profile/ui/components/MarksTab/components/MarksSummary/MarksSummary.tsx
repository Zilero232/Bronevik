'use client';

import { MarkOfExcellenceIcon, MasteryIcon } from '@bronevik/icons';
import { useFormatter, useTranslations } from 'next-intl';

import { AnimatedNumber, ProgressBar } from '@/ui-kit';

import type { MarksSummaryProps } from './MarksSummary.types';

import s from './MarksSummary.module.scss';

export const MarksSummary = ({ summary }: MarksSummaryProps) => {
  const t = useTranslations('profile.marks');
  const format = useFormatter();

  const { moe3, moe2, moe1, mastery, eligible } = summary;
  const items = [
    { key: 'moe3', value: moe3, icon: <MarkOfExcellenceIcon marks={3} size={28} strokeWidth={1.5} /> },
    { key: 'moe2', value: moe2, icon: <MarkOfExcellenceIcon marks={2} size={28} strokeWidth={1.5} /> },
    { key: 'moe1', value: moe1, icon: <MarkOfExcellenceIcon marks={1} size={28} strokeWidth={1.5} /> },
    { key: 'mastery', value: mastery, icon: <MasteryIcon tinted level='master' size={28} strokeWidth={1.5} /> }
  ] as const;

  return (
    <div className={s.root}>
      <dl className={s.counts}>
        {items.map(({ key, value, icon }) => (
          <div key={key} className={s.count} data-kind={key}>
            <span aria-hidden className={s.icon}>
              {icon}
            </span>
            <dt className={s.label}>{t(`summary.${key}`)}</dt>
            <dd className={s.value}>
              <AnimatedNumber value={value} />
            </dd>
          </div>
        ))}
      </dl>
      <ProgressBar
        className={s.collection}
        label={t('collection')}
        max={Math.max(eligible, 1)}
        tone='accent'
        value={moe3}
        valueLabel={t('collectionValue', { done: format.number(moe3), total: format.number(eligible) })}
      />
    </div>
  );
};
