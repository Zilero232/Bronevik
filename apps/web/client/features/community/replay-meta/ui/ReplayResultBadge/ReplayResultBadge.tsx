import { useTranslations } from 'next-intl';

import { Badge } from '@/ui-kit';

import type { ReplayResultBadgeProps } from './ReplayResultBadge.types';

import { REPLAY_RESULT_TONE } from '../../config';

export const ReplayResultBadge = ({ result, className }: ReplayResultBadgeProps) => {
  const t = useTranslations('replays.results');

  if (result === null) {
    return <span className={className}>—</span>;
  }

  return (
    <Badge className={className} tone={REPLAY_RESULT_TONE[result]}>
      {t(result)}
    </Badge>
  );
};
