'use client';

import { useQueryStates } from 'nuqs';

import type { PlatoonFilters, PlatoonVoiceFilter } from '../../../lib/platoon-query';

import { PLATOON_BOARD, PLATOON_FILTER_PARSERS } from '../../../config';
import { hasActiveFilters, nextSingleTier, toWn8Bound } from '../../../lib/platoon-query';

export const usePlatoonFilters = () => {
  const [filters, setFilters] = useQueryStates(PLATOON_FILTER_PARSERS, { history: 'replace' });

  const current: PlatoonFilters = filters;

  return {
    filters: current,
    isFiltered: hasActiveFilters(current),
    tierValue: current.tier === null ? [] : [String(current.tier)],
    onTiersChange: (next: string[]) => void setFilters({ tier: nextSingleTier({ next, current: current.tier }) }),
    modeValue: current.mode ?? PLATOON_BOARD.anyMode,
    onModeChange: (mode: string) => void setFilters({ mode: mode === PLATOON_BOARD.anyMode ? null : mode }),
    onVoiceChange: (voice: PlatoonVoiceFilter) => void setFilters({ voice }),
    onMinWn8Change: (value: string) => void setFilters({ minWn8: toWn8Bound(value) }),
    onMaxWn8Change: (value: string) => void setFilters({ maxWn8: toWn8Bound(value) }),
    onAtChange: (value: string) => void setFilters({ at: value === '' ? null : value }),
    onReset: () => void setFilters({ tier: null, mode: null, voice: null, minWn8: null, maxWn8: null, at: null })
  };
};
