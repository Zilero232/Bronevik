'use client';

import { useTranslations } from 'next-intl';

import type { ChargeCellProps } from './ChargeCell.types';

import s from './ChargeCell.module.scss';

export const ChargeCell = ({ isAutoCharge }: ChargeCellProps) => {
  const t = useTranslations('billing.history');

  return <span className={s.root}>{t(isAutoCharge ? 'auto' : 'manual')}</span>;
};
