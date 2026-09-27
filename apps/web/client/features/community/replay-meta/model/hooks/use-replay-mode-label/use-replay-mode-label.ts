'use client';

import { useTranslations } from 'next-intl';

import { useMapLabels } from '@/entities/map/map';

import { REPLAY_MODE_KEYS } from '../../../config';

export const useReplayModeLabel = () => {
  const t = useTranslations('replays.modes');
  const mapLabels = useMapLabels();

  return (mode: string) => {
    const key = REPLAY_MODE_KEYS.find((known) => known === mode);

    return key ? t(key) : mapLabels.mode(mode);
  };
};
