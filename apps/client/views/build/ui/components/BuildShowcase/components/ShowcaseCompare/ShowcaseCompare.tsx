'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { DeltaValue } from '@/ui-kit';

import { useShowcaseComparison } from '../../../../../model/hooks';

import s from './ShowcaseCompare.module.scss';

export const ShowcaseCompare = () => {
  const t = useTranslations('builds.showcase');
  const format = useFormatter();
  const { items, other, isShown } = useShowcaseComparison();

  if (!isShown) {
    return null;
  }

  return (
    <dl className={s.root}>
      {items.map((item) => (
        <div key={item.id} className={s.item}>
          <dt className={s.label}>{t(`compare.${item.id}`)}</dt>
          <dd className={s.value}>
            {item.value === null ? '—' : format.number(item.isPercent ? item.value / 100 : item.value, item.isPercent ? 'percent' : 'integer')}
          </dd>
          {item.delta !== null && item.verdict !== null && (
            <dd className={s.delta}>
              <DeltaValue
                isSameShown
                format={{ maximumFractionDigits: item.isPercent ? 2 : 0 }}
                suffix={item.isPercent ? ` ${t('compare.points')}` : ''}
                value={item.delta}
                verdict={item.verdict}
              />
              <span className={s.vs}>{t('compare.vs', { other: t(`source.${other}`) })}</span>
            </dd>
          )}
        </div>
      ))}
    </dl>
  );
};
