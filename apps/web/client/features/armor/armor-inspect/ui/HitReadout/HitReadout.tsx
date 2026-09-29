'use client';

import { useTranslations } from 'next-intl';

import type { HitReadoutProps } from './HitReadout.types';

import { useHitReadout } from '../../model/hooks';

import s from './HitReadout.module.scss';

export const HitReadout = ({ report, pieceKind }: HitReadoutProps) => {
  const t = useTranslations('armor');
  const rows = useHitReadout(report);

  return (
    <div aria-live='polite' className={s.root} data-verdict={report.verdict} role='status'>
      <p className={s.head}>
        <span className={s.piece}>{t(`pieces.${pieceKind}`)}</span>
        <span className={s.plate}>{report.first.plate}</span>
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
        {t(`hit.verdict.${report.verdict}`)}
        {report.first.overmatch && <span className={s.flag}>{t('hit.overmatch')}</span>}
      </p>
    </div>
  );
};
