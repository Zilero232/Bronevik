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
  const accountId = profile.data?.summary.accountId ?? 0;
  const wrapped = useQuery({ ...playerQueries.wrapped({ accountId, year }), enabled: accountId > 0 });
  const nickname = profile.data?.summary.nickname ?? requested;
  const vehicles = vehicleIndex(catalog);
  const share = useWrappedShare({ nickname, year });

  return {
    profile,
    wrapped,
    nickname,
    share,
    chapters: wrapped.data ? wrappedChapters(wrapped.data) : [],
    topTanks: (wrapped.data?.topTanks ?? []).map((tank, index) => ({ ...tank, place: index + 1, vehicle: vehicles[tank.tankId] ?? null })),
    bestVehicle: wrapped.data?.bestBattle ? (vehicles[wrapped.data.bestBattle.tankId] ?? null) : null,
    years: wrappedYears({ now, year }).map((option) => ({
      year: option,
      href: ROUTES.players.wrapped({ nickname, year: option }),
      isCurrent: option === year
    }))
  };
};
