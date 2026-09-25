'use client';

import type { VehicleSummary } from '@bronevik/schemas';

import { MOE, projectMoeBattles } from '@bronevik/ratings';
import { useDebounceValue } from '@siberiacancode/reactuse';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { projectMoe } from '@/shared/api/marks';
import { QUERY_KEYS } from '@/shared/constants';

import type { TargetMarks } from './use-moe-projection.types';

import { MOE_PROJECTION } from '../../../config';
import { projectionCurve } from '../../../lib/moe-curve';
import { toMoeThresholds } from '../../../lib/moe-thresholds';
import { useMoeHistory } from '../use-moe-history';

const { defaults } = MOE_PROJECTION;

export const useMoeProjection = () => {
  const [vehicle, setVehicle] = useState<VehicleSummary | null>(null);
  const [percent, setPercent] = useState<number>(defaults.percent);
  const [damage, setDamage] = useState<number | null>(defaults.damage);
  const [marks, setMarks] = useState<TargetMarks>(`${defaults.marks}`);
  const { data: history, isPending: isThresholdPending } = useMoeHistory({ tankId: vehicle?.tankId ?? null });
  const request = useDebounceValue(
    { tankId: vehicle?.tankId ?? 0, currentPercent: percent, targetMarks: Number(marks), avgDamage: damage ?? 0 },
    MOE_PROJECTION.debounceMs
  );

  const { data: remote, isFetching } = useQuery({
    queryKey: QUERY_KEYS.marks.projection(request),
    queryFn: ({ signal }) => projectMoe({ ...request, signal }),
    enabled: request.tankId > 0 && request.avgDamage > 0,
    placeholderData: keepPreviousData
  });

  const latest = history?.at(-1);
  const thresholds = latest ? toMoeThresholds(latest) : null;
  const targetPercent = MOE.markPercents[Number(marks) - 1] ?? MOE.maxPercent;
  const averageDamage = damage ?? 0;
  const local =
    thresholds && averageDamage > 0
      ? projectMoeBattles({ currentPercent: percent, targetPercent, averageCombinedDamage: averageDamage, thresholds })
      : null;

  const battles = remote && remote.tankId === vehicle?.tankId ? remote.battlesNeeded : (local?.battles ?? null);

  return {
    inputs: { vehicle, percent, damage, marks },
    setters: { setVehicle, setPercent, setDamage, setMarks },
    threshold: latest ?? null,
    targetPercent,
    targetDamage: local?.targetEma ?? null,
    battles,
    hasResult: local !== null,
    isLoading: vehicle !== null && isThresholdPending,
    isRefreshing: isFetching,
    curve: thresholds && averageDamage > 0 ? projectionCurve({ currentPercent: percent, averageDamage, thresholds, battlesNeeded: battles }) : []
  };
};
