import { useTranslations } from 'next-intl';

import { Badge } from '@/ui-kit';

import type { TankStatusBadgeProps } from './TankStatusBadge.types';

import { STATUS_TONE } from '../../config';

export const TankStatusBadge = ({ status, className }: TankStatusBadgeProps) => {
  const t = useTranslations('tankTraits.status');

  return (
    <Badge className={className} tone={STATUS_TONE[status]}>
      {t(status)}
    </Badge>
  );
};
