'use client';

import { useQuery } from '@tanstack/react-query';
import { useQueryStates } from 'nuqs';
import { useEffect } from 'react';
import { match } from 'ts-pattern';

import { BUILD_URL } from '@/entities/tank/build';

import { buildQueries } from '../../../api';
import { PRESET_PARSERS } from '../../../config';
import { useBuildContext } from '../../context';

export const useRecommendedPreset = () => {
  const { vehicle, edit } = useBuildContext();
  const [state, setState] = useQueryStates(PRESET_PARSERS, { history: 'replace' });

  const isRequested = state[BUILD_URL.preset] !== null;
  const {
    data: recommended,
    isPending,
    isError
  } = useQuery({
    ...buildQueries.recommended({ tankId: vehicle.tankId, mode: state[BUILD_URL.mode], cohort: state[BUILD_URL.cohort] }),
    enabled: isRequested
  });

  const loadout = recommended?.loadout ?? null;

  useEffect(() => {
    if (!isRequested || !loadout) {
      return;
    }

    edit(() => loadout);
    void setState({ [BUILD_URL.preset]: null, [BUILD_URL.mode]: null, [BUILD_URL.cohort]: null });
  }, [edit, isRequested, loadout, setState]);

  const status = match({ isRequested, isPending, isError, loadout })
    .with({ isRequested: false }, () => null)
    .with({ isError: true }, () => 'error' as const)
    .with({ isPending: true }, () => 'loading' as const)
    .with({ loadout: null }, () => 'missing' as const)
    .otherwise(() => null);

  const onDismiss = () => {
    void setState({ [BUILD_URL.preset]: null, [BUILD_URL.mode]: null, [BUILD_URL.cohort]: null });
  };

  return { status, battles: recommended?.usage.battles ?? 0, minSample: recommended?.usage.minSample ?? 0, onDismiss };
};
