'use client';

import type { Loadout } from '@bronevik/schemas';

import { useQueryStates } from 'nuqs';

import { BUILD_URL, emptyLoadout } from '@/entities/tank/build';

import { LOADOUT_PARSERS } from '../../../config';

export const useBuildLoadouts = () => {
  const [state, setState] = useQueryStates(LOADOUT_PARSERS, { history: 'replace' });

  const a = state[BUILD_URL.primary] ?? emptyLoadout();
  const b = state[BUILD_URL.compare];

  const setA = (loadout: Loadout) => setState({ [BUILD_URL.primary]: loadout });
  const setB = (loadout: Loadout | null) => setState({ [BUILD_URL.compare]: loadout });

  return { a, b, setA, setB };
};
