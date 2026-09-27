'use client';

import { useFormatter, useTranslations } from 'next-intl';

import type { Replay } from '@/entities/replay/replay';

import { ROUTES } from '@/shared/constants';
import { PERCENT_TEXT } from '@/shared/lib';

import { REPLAY_CARD } from '../../../config';

export const useReplayCard = (replay: Replay) => {
  const t = useTranslations('replays.list');
  const format = useFormatter();

  return {
    href: ROUTES.replays.detail(replay.id),
    mapName: replay.mapName ?? replay.arenaId ?? t('unknownMap'),
    figures: REPLAY_CARD.figures.map(({ id, key }) => {
      const value = replay[key];

      return { id, label: t(`columns.${id}`), value: value === null ? PERCENT_TEXT.empty : format.number(value) };
    })
  };
};
