'use client';

import { useFormatter, useTranslations } from 'next-intl';

import type { HitReadoutProps } from './HitReadout.types';

import s from './HitReadout.module.scss';

export const HitReadout = ({ report, pieceKind }: HitReadoutProps) => {
  const t = useTranslations('armor');
  const format = useFormatter();
  const { first, total, penetration, chance, layerCount, verdict } = report;

  const rows = [
    { key: 'nominal', value: t('hit.mm', { value: first.thickness }) },
    { key: 'angle', value: t('hit.degrees', { value: Math.round(first.angle) }) },
    { key: 'effective', value: t('hit.mm', { value: Math.round(first.effective) }) },
    { key: 'total', value: `${t('hit.mm', { value: Math.round(total) })} · ${t('hit.layers', { count: layerCount })}` },
    { key: 'penetration', value: t('hit.mm', { value: Math.round(penetration) }) },
    { key: 'chanceLabel', value: format.number(chance, { style: 'percent', maximumFractionDigits: 0 }) }
  ] as const;

  return (
    <div aria-live='polite' className={s.root} data-verdict={verdict} role='status'>
      <p className={s.head}>
        <span className={s.piece}>{t(`pieces.${pieceKind}`)}</span>
        <span className={s.plate}>{first.plate}</span>
      </p>
      <dl className={s.rows}>
        {rows.map(({ key, value }) => (
          <div key={key} className={s.row}>
            <dt>{t(`hit.${key}`)}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <p className={s.verdict}>
        {t(`hit.verdict.${verdict}`)}
        {first.overmatch && <span className={s.flag}>{t('hit.overmatch')}</span>}
      </p>
    </div>
  );
};
