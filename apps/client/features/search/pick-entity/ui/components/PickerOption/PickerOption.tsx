'use client';

import { useFormatter } from 'next-intl';

import { PlayerIdentity } from '@/entities/player/player';
import { TankIdentity, vehicleIdentity } from '@/entities/tank/tank';
import { toneOfTier } from '@/shared/lib';
import { RatingBadge } from '@/ui-kit';

import type { PickerOptionProps } from './PickerOption.types';

import s from './PickerOption.module.scss';

export const PickerOption = ({ result }: PickerOptionProps) => {
  const format = useFormatter();

  if (result.kind === 'tank') {
    return <TankIdentity tank={vehicleIdentity(result.vehicle)} />;
  }

  const { nickname, clanTag, wn8, battles } = result;

  return (
    <span className={s.root}>
      <PlayerIdentity player={{ nickname, clanTag }} />
      {battles !== null && <span className={s.battles}>{format.number(battles, { notation: 'compact' })}</span>}
      {wn8.value !== null && (
        <RatingBadge size='sm' tone={wn8.tier ? toneOfTier(wn8.tier) : 'average'} value={format.number(wn8.value)} withPips={false} />
      )}
    </span>
  );
};
