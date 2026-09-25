'use client';

import { useTranslations } from 'next-intl';

import { TANK_SPECS, useSpecFormat } from '@/entities/tank/tank';
import { DeltaValue } from '@/ui-kit';

import type { StatRowProps } from './StatRow.types';

import { StatValue } from '../StatValue';

import s from './StatRow.module.scss';

export const StatRow = ({ row }: StatRowProps) => {
  const t = useTranslations('builds.stats');
  const format = useSpecFormat();

  const { key, base, a, delta, verdict, fill } = row;

  return (
    <tr className={s.root}>
      <th className={s.label} scope='row'>
        {format.label(key)}
        {verdict !== 'same' && <span className={s.base}>{t('base', { value: format.value({ key, value: base }) })}</span>}
      </th>
      <td className={s.value}>
        <StatValue fill={fill} statKey={key} value={a} verdict={verdict} />
      </td>
      <td className={s.delta}>
        <DeltaValue format={{ maximumFractionDigits: TANK_SPECS[key].digits }} value={delta ?? 0} verdict={verdict} />
      </td>
    </tr>
  );
};
