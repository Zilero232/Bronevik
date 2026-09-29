'use client';

import { useFormatter, useTranslations } from 'next-intl';

import type { Replay } from '@/entities/replay/replay';

import { useReplayMapName } from '@/features/community/replay-meta';
import { ROUTES } from '@/shared/constants';
import { PERCENT_TEXT } from '@/shared/lib';

import { REPLAY_CARD } from '../../../config';

export const useReplayCard = (replay: Replay) => {
  const t = useTranslations('replays.list');
  const tTags = useTranslations('replays.tags');
  const format = useFormatter();
  const mapNameOf = useReplayMapName();

  return {
    href: ROUTES.replays.detail(replay.id),
    mapName: mapNameOf(replay) ?? t('unknownMap'),
    tags: replay.tags.map((tag) => ({ tag, label: tTags(`${tag}.label`) })),
    figures: REPLAY_CARD.figures.map(({ id, key }) => {
      const value = replay[key];

      return { id, label: t(`columns.${id}`), value: value === null ? PERCENT_TEXT.empty : format.number(value) };
    })
  };
};
