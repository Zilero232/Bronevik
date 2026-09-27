'use client';

import { useTranslations } from 'next-intl';

import { Badge } from '@/ui-kit';

import type { StatusCellProps } from './StatusCell.types';

import { paymentTone } from '../../../../../lib/status-tone';

export const StatusCell = ({ status }: StatusCellProps) => {
  const t = useTranslations('billing.history.statuses');

  return <Badge tone={paymentTone(status)}>{t(status)}</Badge>;
};
