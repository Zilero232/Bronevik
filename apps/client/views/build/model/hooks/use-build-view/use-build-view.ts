'use client';

import { useQueryState, useQueryStates } from 'nuqs';

import { BUILD_URL } from '@/entities/tank/build';

import type { BuildView } from './use-build-view.types';

import { LOADOUT_PARSERS, PRESET_PARSERS, SHOWCASE_PARSERS } from '../../../config';

export const useBuildView = () => {
  const [view, setView] = useQueryState('view', SHOWCASE_PARSERS.view.withOptions({ history: 'replace' }));
  const [loadouts] = useQueryStates(LOADOUT_PARSERS);
  const [presets] = useQueryStates(PRESET_PARSERS);

  const hasLoadout = loadouts[BUILD_URL.primary] !== null || loadouts[BUILD_URL.compare] !== null || presets[BUILD_URL.preset] !== null;

  const onViewChange = (next: BuildView) => {
    void setView(next);
  };

  return { view: view ?? (hasLoadout ? 'editor' : 'showcase'), onViewChange };
};
