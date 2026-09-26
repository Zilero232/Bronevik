'use client';

import { useTranslations } from 'next-intl';

import { Badge } from '@/ui-kit';

import type { DeliveryStatusCellProps } from './DeliveryStatusCell.types';

import { DELIVERY_STATUS_TONE } from '../../../../../config';

export const DeliveryStatusCell = ({ status }: DeliveryStatusCellProps) => {
  const t = useTranslations('developer.deliveries');

  return <Badge tone={DELIVERY_STATUS_TONE[status]}>{t(`statuses.${status}`)}</Badge>;
};
