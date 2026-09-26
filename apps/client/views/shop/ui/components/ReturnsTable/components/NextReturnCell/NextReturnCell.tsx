import { useFormatter, useTranslations } from 'next-intl';

import { Badge } from '@/ui-kit';

import type { NextReturnCellProps } from './NextReturnCell.types';

import { SHOP } from '../../../../../config';

import s from './NextReturnCell.module.scss';

export const NextReturnCell = ({ row: { nextExpectedAt, outlook } }: NextReturnCellProps) => {
  const t = useTranslations('shop.returns.outlook');
  const format = useFormatter();

  return (
    <span className={s.root}>
      {nextExpectedAt && <span className={s.date}>{format.dateTime(new Date(nextExpectedAt), { dateStyle: 'medium' })}</span>}
      <Badge tone={SHOP.outlookTone[outlook.state]}>{t(outlook.state, { days: outlook.days ?? 0 })}</Badge>
    </span>
  );
};
