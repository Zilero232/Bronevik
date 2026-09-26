import { useTranslations } from 'next-intl';

import { Badge } from '@/ui-kit';

import type { TankRoleBadgeProps } from './TankRoleBadge.types';

export const TankRoleBadge = ({ role, className }: TankRoleBadgeProps) => {
  const t = useTranslations('tankTraits.role');

  return (
    <Badge className={className} tone='steel'>
      {t(role)}
    </Badge>
  );
};
