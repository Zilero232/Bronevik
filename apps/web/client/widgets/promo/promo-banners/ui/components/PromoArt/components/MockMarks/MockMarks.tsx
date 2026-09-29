import { Mark3Icon } from '@otmetki/icons';
import { Check } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

import { Sparkline } from '@/ui-kit';

import { PROMO_ICON, PROMO_MOCK } from '../../../../../config';
import { MockWindow } from '../MockWindow';

import s from './MockMarks.module.scss';

export const MockMarks = () => {
  const t = useTranslations('promo.mock.marks');
  const format = useFormatter();
  const { percent, delta, trend, thresholds, damageToNext, battlesToNext } = PROMO_MOCK.marks;

  return (
    <MockWindow title={t('title')}>
      <div className={s.head}>
        <Mark3Icon className={s.mark} size={PROMO_ICON.mockSide} />
        <span className={s.value}>{format.number(percent / 100, { style: 'percent', minimumFractionDigits: 2 })}</span>
        <span className={s.delta}>{format.number(delta, { signDisplay: 'always', minimumFractionDigits: 2 })}</span>
      </div>
      <Sparkline withArea className={s.chart} data={[...trend]} height={64} tone='gold' width={360} />
      <ul className={s.thresholds}>
        {thresholds.map(({ key, value, isDone }) => (
          <li key={key} className={s.threshold} data-done={isDone || undefined}>
            <span className={s.thresholdValue}>{format.number(value / 100, { style: 'percent' })}</span>
            <span className={s.thresholdState}>{isDone ? <Check size={PROMO_ICON.mock} /> : format.number(damageToNext)}</span>
          </li>
        ))}
      </ul>
      <p className={s.foot}>
        <span>{t('battles')}</span>
        <span className={s.footValue}>{format.number(battlesToNext)}</span>
      </p>
    </MockWindow>
  );
};
