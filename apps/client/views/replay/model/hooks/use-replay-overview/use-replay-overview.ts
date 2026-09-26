'use client';

import { useFormatter, useTranslations } from 'next-intl';

import type { Replay } from '@/shared/api/replays';

import { vehicleIndex } from '@/entities/tank/tank';
import { useReplayModeLabel } from '@/features/community/replay-meta';
import { useVehicleCatalog } from '@/features/tank/pick-tank';
import { safeWebHref } from '@/shared/lib';

import { formatClock } from '../../../lib/battle-timeline';

export const useReplayOverview = (replay: Replay) => {
  const t = useTranslations('replays.detail');
  const format = useFormatter();
  const modeLabel = useReplayModeLabel();
  const { data: catalog } = useVehicleCatalog();

  const vehicles = vehicleIndex(catalog);
  const owner = replay.owner;

  return {
    title: replay.mapName ?? replay.arenaId ?? t('untitled'),
    vehicle: owner ? (vehicles[owner.tankId] ?? null) : null,
    owner,
    mode: replay.battleType,
    modeLabel: replay.battleType ? modeLabel(replay.battleType) : null,
    downloadHref: safeWebHref(replay.downloadUrl),
    duration: replay.durationSec === null ? null : formatClock(replay.durationSec),
    playedAt: replay.playedAt ? format.dateTime(new Date(replay.playedAt), { dateStyle: 'medium', timeStyle: 'short' }) : null,
    figures: {
      damageDealt: replay.damageDealt,
      damageAssisted: replay.damageAssisted,
      frags: replay.frags,
      xp: replay.xp,
      damageBlocked: owner?.damageBlocked ?? null,
      spotted: owner?.spotted ?? null
    }
  };
};
