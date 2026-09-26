'use client';

import { useDebounceValue } from '@siberiacancode/reactuse';
import { useQueryStates } from 'nuqs';

import type { ReplayFilters } from '../../../lib/replay-query';

import { REPLAY_LIST, REPLAYS_URL_PARSERS } from '../../../config';

type ReplayFiltersPatch = Partial<Omit<ReplayFilters, 'offset'>>;

export const useReplayFilters = () => {
  const [state, setState] = useQueryStates(REPLAYS_URL_PARSERS, { history: 'replace' });
  const player = useDebounceValue(state.player, REPLAY_LIST.playerDebounceMs);

  const filters: ReplayFilters = {
    tank: state.tank,
    map: state.map,
    mode: state.mode,
    player,
    result: state.result,
    sort: state.sort,
    offset: state.offset
  };

  const update = (patch: ReplayFiltersPatch) => void setState({ ...patch, offset: null });

  return {
    tab: state.tab,
    playerDraft: state.player,
    filters,
    update,
    setTab: (tab: typeof state.tab) => void setState({ tab, offset: null }),
    setOffset: (offset: number) => void setState({ offset: offset > 0 ? offset : null }),
    reset: () => void setState({ tank: null, map: null, mode: null, player: null, result: null, offset: null })
  };
};
