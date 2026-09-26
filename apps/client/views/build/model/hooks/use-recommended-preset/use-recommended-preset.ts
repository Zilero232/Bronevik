'use client';

import { skipToken, useQuery } from '@tanstack/react-query';
import { useQueryStates } from 'nuqs';
import { useEffect } from 'react';
import { match } from 'ts-pattern';

import { BUILD_URL } from '@/entities/tank/build';
import { getRecommendedBuild } from '@/entities/tank/build';
import { QUERY_KEYS } from '@/shared/constants';

import { BUILD_VIEW, PRESET_PARSERS } from '../../../config';
import { useBuildContext } from '../../context';

export const useRecommendedPreset = () => {
  const { vehicle, edit } = useBuildContext();
  const [state, setState] = useQueryStates(PRESET_PARSERS, { history: 'replace' });

  const isRequested = state[BUILD_URL.preset] !== null;
  const params = { tankId: vehicle.tankId, mode: state[BUILD_URL.mode], cohort: state[BUILD_URL.cohort] };

  const query = useQuery({
    queryKey: QUERY_KEYS.builds.recommended(params),
    queryFn: isRequested ? ({ signal }) => getRecommendedBuild({ ...params, signal }) : skipToken,
    staleTime: BUILD_VIEW.staleMs
  });

  const loadout = query.data?.loadout ?? null;

  useEffect(() => {
    if (!isRequested || !loadout) {
      return;
    }

    edit(() => loadout);
    void setState({ [BUILD_URL.preset]: null, [BUILD_URL.mode]: null, [BUILD_URL.cohort]: null });
  }, [edit, isRequested, loadout, setState]);

  const status = match({ isRequested, isPending: query.isPending, isError: query.isError, loadout })
    .with({ isRequested: false }, () => null)
    .with({ isError: true }, () => 'error' as const)
    .with({ isPending: true }, () => 'loading' as const)
    .with({ loadout: null }, () => 'missing' as const)
    .otherwise(() => null);

  const onDismiss = () => {
    void setState({ [BUILD_URL.preset]: null, [BUILD_URL.mode]: null, [BUILD_URL.cohort]: null });
  };

  return { status, battles: query.data?.usage.battles ?? 0, minSample: query.data?.usage.minSample ?? 0, onDismiss };
};
