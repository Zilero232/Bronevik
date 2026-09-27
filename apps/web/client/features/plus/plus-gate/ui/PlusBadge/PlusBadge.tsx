import { useTranslations } from 'next-intl';

import { Badge } from '@/ui-kit';

import type { PlusBadgeProps } from './PlusBadge.types';

export const PlusBadge = ({ className }: PlusBadgeProps) => {
  const t = useTranslations('plus');

  return (
    <Badge className={className} tone='premium'>
      {t('badge')}
    </Badge>
  );
};
