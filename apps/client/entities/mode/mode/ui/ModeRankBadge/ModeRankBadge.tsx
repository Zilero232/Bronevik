import { useTranslations } from 'next-intl';

import { RatingBadge } from '@/ui-kit';

import type { ModeRankBadgeProps } from './ModeRankBadge.types';

import { MODE_RANK_TONE } from '../../config';

export const ModeRankBadge = ({ rank, size = 'sm', className }: ModeRankBadgeProps) => {
  const t = useTranslations('modes.rank');

  if (rank === null) {
    return (
      <span className={className} title={t('none')}>
        —
      </span>
    );
  }

  return <RatingBadge className={className} size={size} title={t('hint', { rank })} tone={MODE_RANK_TONE[rank]} value={rank} withPips={false} />;
};
