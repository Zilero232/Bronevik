'use client';

import { useTranslations } from 'next-intl';

import { LimitNotice, PlusGate } from '@/features/plus/plus-gate';
import { TankPicker } from '@/features/tank/pick-tank';

import type { FollowExtrasProps } from './FollowExtras.types';

import { useFollowTank } from '../../../../../model/hooks';

import s from './FollowExtras.module.scss';

export const FollowExtras = ({ state }: FollowExtrasProps) => {
  const t = useTranslations('streamersDirectory.follow');
  const { vehicle, onVehicleChange } = useFollowTank(state);

  if (!state.isFollowing) {
    return <LimitNotice limitKey='streamerFollows' used={state.followsCount} />;
  }

  return (
    <div className={s.root}>
      <PlusGate feature='streamerAlerts'>
        <TankPicker className={s.picker} label={t('tankTitle')} placeholder={t('tankPlaceholder')} value={vehicle} onChange={onVehicleChange} />
        <p className={s.hint}>{t('tankHint')}</p>
      </PlusGate>
    </div>
  );
};
