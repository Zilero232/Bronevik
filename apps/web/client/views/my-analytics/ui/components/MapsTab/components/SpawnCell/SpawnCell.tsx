import { useTranslations } from 'next-intl';

import type { SpawnCellProps } from './SpawnCell.types';

export const SpawnCell = ({ team }: SpawnCellProps) => {
  const t = useTranslations('analytics.maps');

  return team ? t('spawn', { team }) : t('spawnUnknown');
};
