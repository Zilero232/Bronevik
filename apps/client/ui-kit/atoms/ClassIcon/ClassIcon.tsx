import { TANK_CLASS_KIND_ICONS } from '@otmetki/icons';
import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';

import type { ClassIconProps } from './ClassIcon.types';

import s from './ClassIcon.module.scss';

export const ClassIcon = ({ tankClass, variant = 'regular', display = 'glyph', size = 16, className }: ClassIconProps) => {
  const t = useTranslations('game.classes');
  const Icon = TANK_CLASS_KIND_ICONS[tankClass];

  if (display === 'tag') {
    return (
      <span className={clsx(s.tag, className)} data-class={tankClass}>
        <Icon size={size} variant={variant} />
        {t(tankClass)}
      </span>
    );
  }

  return <Icon className={className} size={size} title={t(tankClass)} variant={variant} />;
};
