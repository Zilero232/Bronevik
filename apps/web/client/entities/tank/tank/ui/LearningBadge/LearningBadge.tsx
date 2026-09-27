import { useTranslations } from 'next-intl';

import { Badge } from '@/ui-kit';

import type { LearningBadgeProps } from './LearningBadge.types';

import { DIFFICULTY_TONE } from '../../config';

export const LearningBadge = ({ difficulty, className }: LearningBadgeProps) => {
  const t = useTranslations('tankTraits.difficulty');

  return (
    <Badge className={className} tone={DIFFICULTY_TONE[difficulty]}>
      {t(difficulty)}
    </Badge>
  );
};
