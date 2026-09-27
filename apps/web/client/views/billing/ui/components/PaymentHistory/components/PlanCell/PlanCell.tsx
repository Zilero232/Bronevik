'use client';

import { useTranslations } from 'next-intl';

import type { PlanCellProps } from './PlanCell.types';

import s from './PlanCell.module.scss';

export const PlanCell = ({ plan }: PlanCellProps) => {
  const t = useTranslations('billing.history');

  return plan ? t(`plans.${plan}`) : <span className={s.dim}>—</span>;
};
