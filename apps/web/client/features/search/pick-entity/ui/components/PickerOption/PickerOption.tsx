'use client';

import { useFormatter } from 'next-intl';

import { PlayerIdentity } from '@/entities/player/player';
import { TankCell } from '@/entities/tank/tank';
import { toneOfTier } from '@/shared/lib';

import type { PickerOptionProps } from './PickerOption.types';

import s from './PickerOption.module.scss';

export const PickerOption = ({ result }: PickerOptionProps) => {
  const format = useFormatter();

  if (result.kind === 'tank') {
    return <TankCell image='contour' vehicle={result.vehicle} />;
  }

  const { nickname, clanTag, wn8, battles } = result;

  return (
    <span className={s.root}>
      <PlayerIdentity player={{ nickname, clanTag }} withAvatar={false} />
      {battles !== null && <span className={s.battles}>{format.number(battles, { notation: 'compact' })}</span>}
      {wn8.value !== null && (
        <span className={s.rating} data-tone={wn8.tier ? toneOfTier(wn8.tier) : 'average'}>
          {format.number(wn8.value)}
        </span>
      )}
    </span>
  );
};
