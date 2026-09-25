'use client';

import { AnimatedMarkOfExcellence } from '@bronevik/icons';
import { useTranslations } from 'next-intl';

import { AnimatedNumber, DeltaValue } from '@/ui-kit';

import type { MarkPlateProps } from './MarkPlate.types';

import { MARK_ICONS, thresholdVerdict } from './MarkPlate.helpers';

import s from './MarkPlate.module.scss';

export const MarkPlate = ({ moeKey, percent, marks, value, deltas, isFeatured }: MarkPlateProps) => {
  const t = useTranslations('tank.marks');

  const Icon = MARK_ICONS[marks];

  return (
    <article className={s.root} data-featured={isFeatured}>
      <header className={s.head}>
        <span className={s.icon}>
          {isFeatured ? <AnimatedMarkOfExcellence aria-hidden marks={marks} size={40} /> : <Icon aria-hidden size={32} />}
        </span>
        <span className={s.titles}>
          <span className={s.percent}>{`${percent}%`}</span>
          <span className={s.caption}>{t(`plates.${moeKey}`)}</span>
        </span>
      </header>
      <p className={s.value}>
        {value === null ? '—' : <AnimatedNumber value={value} />}
        <span className={s.unit}>{t('damageUnit')}</span>
      </p>
      <dl className={s.deltas}>
        {deltas.map(({ days, value: delta }) => (
          <div key={days} className={s.delta}>
            <dt>{t('deltaDays', { days })}</dt>
            <dd>{delta === null ? '—' : <DeltaValue format={{ maximumFractionDigits: 0 }} value={delta} verdict={thresholdVerdict(delta)} />}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
};
