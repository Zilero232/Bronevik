import { useTranslations } from 'next-intl';

import { TierNumeral } from '@/ui-kit';

import type { TierMarkProps } from './TierMark.types';

import { MAP_STATS } from '../../../config';

import s from './TierMark.module.scss';

export const TierMark = ({ tier }: TierMarkProps) => {
  const t = useTranslations('mapStats.filters');

  return tier === MAP_STATS.allTiers ? <span className={s.all}>{t('allShort')}</span> : <TierNumeral tier={tier} variant='hex' />;
};
