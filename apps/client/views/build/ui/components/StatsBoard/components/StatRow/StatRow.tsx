'use client';

import { useTranslations } from 'next-intl';

import { TANK_SPECS, useSpecFormat } from '@/entities/tank/tank';
import { DeltaValue } from '@/ui-kit';

import type { StatRowProps } from './StatRow.types';

import { StatValue } from '../StatValue';

import s from './StatRow.module.scss';

export const StatRow = ({ row, isCompare = false }: StatRowProps) => {
  const t = useTranslations('builds.stats');
  const format = useSpecFormat();

  const { key, base, a, b, delta, diff, verdict, verdictB, diffVerdict, winner, fill, fillB } = row;
  const digits = TANK_SPECS[key].digits;

  return (
    <tr className={s.root} data-compare={isCompare}>
      <th className={s.label} scope='row'>
        {format.label(key)}
        {!isCompare && verdict !== 'same' && <span className={s.base}>{t('base', { value: format.value({ key, value: base }) })}</span>}
      </th>
      <td className={s.value}>
        <StatValue fill={fill} isWinner={isCompare && winner === 'a'} statKey={key} value={a} verdict={verdict} />
      </td>
      {isCompare && (
        <td className={s.value}>
          <StatValue fill={fillB ?? 0} isWinner={winner === 'b'} statKey={key} value={b} verdict={verdictB} />
        </td>
      )}
      <td className={s.delta}>
        <DeltaValue format={{ maximumFractionDigits: digits }} value={(isCompare ? diff : delta) ?? 0} verdict={isCompare ? diffVerdict : verdict} />
        {isCompare && winner && (
          <span className={s.winner} data-side={winner}>
            {t('winner', { side: winner.toUpperCase() })}
          </span>
        )}
      </td>
    </tr>
  );
};
