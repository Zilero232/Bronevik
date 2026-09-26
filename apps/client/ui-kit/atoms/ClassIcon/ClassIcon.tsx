import { TANK_CLASS_KIND_ICONS } from '@bronevik/icons';
import { useTranslations } from 'next-intl';

import type { ClassIconProps } from './ClassIcon.types';

export const ClassIcon = ({ tankClass, variant = 'regular', size = 16, className }: ClassIconProps) => {
  const t = useTranslations('game.classes');
  const Icon = TANK_CLASS_KIND_ICONS[tankClass];

  return <Icon className={className} size={size} title={t(tankClass)} variant={variant} />;
};
