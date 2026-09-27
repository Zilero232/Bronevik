import { useFormatter, useTranslations } from 'next-intl';

import { Badge } from '@/ui-kit';

import type { SweatBadgeProps } from './SweatBadge.types';

import { SWEAT_TONE } from '../../config';

export const SweatBadge = ({ level, ratio, kind = 'moe', className }: SweatBadgeProps) => {
  const t = useTranslations('tankTraits.sweat');
  const format = useFormatter();

  return (
    <Badge
      className={className}
      title={ratio === null ? undefined : t(kind === 'moe' ? 'hint' : 'masteryHint', { value: format.number(ratio, { maximumFractionDigits: 2 }) })}
      tone={SWEAT_TONE[level]}
    >
      {t(level)}
    </Badge>
  );
};
