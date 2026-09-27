'use client';

import { useTranslations } from 'next-intl';

import { EntityPicker } from '@/features/search/pick-entity';

import type { AddWatchPlayerProps } from './AddWatchPlayer.types';

import { useAddWatchPlayer } from '../../../model/hooks';

import s from './AddWatchPlayer.module.scss';

export const AddWatchPlayer = ({ excludeIds, isFull }: AddWatchPlayerProps) => {
  const t = useTranslations('watchlist.add');
  const { isAdding, onPick } = useAddWatchPlayer();

  return (
    <EntityPicker
      className={s.root}
      excludeIds={excludeIds}
      isDisabled={isFull || isAdding}
      kind='player'
      placeholder={isFull ? t('full') : t('placeholder')}
      onPick={onPick}
    />
  );
};
