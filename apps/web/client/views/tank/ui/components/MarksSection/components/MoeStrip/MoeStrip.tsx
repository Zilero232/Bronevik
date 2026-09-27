'use client';

import { parseISO } from 'date-fns';
import { useFormatter, useTranslations } from 'next-intl';

import { DeltaValue, EmptyState } from '@/ui-kit';

import { MARK_ICONS } from '../../../../../config';
import { useMoePlates } from '../../../../../model/hooks';

import s from './MoeStrip.module.scss';

export const MoeStrip = () => {
  const t = useTranslations('tank.marks');
  const format = useFormatter();
  const { plates, updatedAt } = useMoePlates();

  if (plates.length === 0) {
    return <EmptyState description={t('noMoeDescription')} title={t('noMoeTitle')} />;
  }

  return (
    <div className={s.root}>
      <ul className={s.strip}>
        {plates.map(({ key, percent, marks, value, deltas }) => {
          const Icon = MARK_ICONS[marks];

          return (
            <li key={key} className={s.plate} data-marks={marks}>
              <span className={s.head}>
                <Icon aria-hidden size={20} />
                <span className={s.percent}>{`${percent}\u00A0%`}</span>
                <span className={s.caption}>{t(`plates.${key}`)}</span>
              </span>
              <span className={s.value}>
                {value === null ? '—' : format.number(value, { maximumFractionDigits: 0 })}
                <span className={s.unit}>{t('damageUnit')}</span>
              </span>
              <span className={s.deltas}>
                {deltas.map(({ days, value: delta, verdict }) => (
                  <span key={days} className={s.delta}>
                    <span className={s.caption}>{t('deltaDays', { days })}</span>
                    {delta === null ? '—' : <DeltaValue format={{ maximumFractionDigits: 0 }} value={delta} verdict={verdict} />}
                  </span>
                ))}
              </span>
            </li>
          );
        })}
      </ul>
      {updatedAt && <p className={s.updated}>{t('updated', { date: format.dateTime(parseISO(updatedAt), { dateStyle: 'medium' }) })}</p>}
    </div>
  );
};
