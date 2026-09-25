'use client';

import { Trophy } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { TANK_SPECS, useSpecFormat } from '@/entities/tank/tank';
import { DeltaValue } from '@/ui-kit';

import type { StatCompareRowProps } from './StatCompareRow.types';

import { StatValue } from '../StatValue';

import s from './StatCompareRow.module.scss';

export const StatCompareRow = ({ row }: StatCompareRowProps) => {
  const t = useTranslations('builds.stats');
  const format = useSpecFormat();

  const { key, a, b, verdict, verdictB, diff, diffVerdict, winner, fill, fillB } = row;

  return (
    <tr className={s.root}>
      <th className={s.label} scope='row'>
        {format.label(key)}
      </th>
      <td className={s.value}>
        <StatValue fill={fill} isWinner={winner === 'a'} statKey={key} value={a} verdict={verdict} />
      </td>
      <td className={s.value}>
        <StatValue fill={fillB ?? 0} isWinner={winner === 'b'} statKey={key} value={b} verdict={verdictB} />
      </td>
      <td className={s.delta}>
        <DeltaValue format={{ maximumFractionDigits: TANK_SPECS[key].digits }} value={diff ?? 0} verdict={diffVerdict} />
        {winner && (
          <span className={s.winner} data-side={winner} title={t('winner', { side: winner.toUpperCase() })}>
            <Trophy aria-hidden size={11} />
            <span className={s.srOnly}>{t('winner', { side: winner.toUpperCase() })}</span>
            {winner.toUpperCase()}
          </span>
        )}
      </td>
    </tr>
  );
};
