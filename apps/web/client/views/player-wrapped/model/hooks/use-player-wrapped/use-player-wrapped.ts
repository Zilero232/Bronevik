'use client';

import { useQuery } from '@tanstack/react-query';

import { playerQueries, usePlayerProfile } from '@/entities/player/profile';
import { vehicleIndex } from '@/entities/tank/tank';
import { useVehicleCatalog } from '@/features/tank/pick-tank';
import { ROUTES } from '@/shared/constants';
import { useClientNow } from '@/shared/lib';

import type { UsePlayerWrappedInput } from './use-player-wrapped.types';

import { wrappedChapters, wrappedYears } from '../../../lib/wrapped-story';
import { useWrappedShare } from '../use-wrapped-share';

export const usePlayerWrapped = ({ nickname: requested, year }: UsePlayerWrappedInput) => {
  const profile = usePlayerProfile(requested);
  const now = useClientNow();
  const { data: catalog } = useVehicleCatalog();
  const summary = profile.data?.summary;
  const wrapped = useQuery({ ...playerQueries.wrapped({ accountId: summary?.accountId ?? 0, year }), enabled: summary !== undefined });
  const share = useWrappedShare({ nickname: summary?.nickname ?? requested, year });

  const { data: story } = wrapped;
  const nickname = summary?.nickname ?? requested;
  const vehicles = vehicleIndex(catalog);

  return {
    profile,
    wrapped,
    nickname,
    share,
    chapters: story ? wrappedChapters(story) : [],
    topTanks: (story?.topTanks ?? []).map((tank, index) => ({ ...tank, place: index + 1, vehicle: vehicles[tank.tankId] ?? null })),
    bestVehicle: story?.bestBattle ? (vehicles[story.bestBattle.tankId] ?? null) : null,
    years: wrappedYears({ now, year, createdAt: summary?.createdAt ?? null, lastBattleAt: summary?.lastBattleAt ?? null }).map((option) => ({
      year: option,
      href: ROUTES.players.wrapped({ nickname, year: option }),
      isCurrent: option === year
    }))
  };
};
