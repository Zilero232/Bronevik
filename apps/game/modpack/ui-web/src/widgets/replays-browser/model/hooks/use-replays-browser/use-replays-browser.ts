import { useMemo, useState } from 'react';

import type { ReplayFilters, ReplaySort } from '../../../../../entities/replays';
import type { FilterPatch, UseReplaysBrowserInput } from './use-replays-browser.types';

import {
  activeFilterCount,
  clearFilters,
  DEFAULT_REPLAY_FILTERS,
  filterReplays,
  parseReplaysPage,
  replayFacets,
  summarizeReplays
} from '../../../../../entities/replays';
import { sortedBy, viewOf } from '../../../lib/browser-view';
import { replayCommands } from '../../actions';
import { useReplayPrompts } from '../use-replay-prompts';

export const useReplaysBrowser = ({ page: raw, enabled, now }: UseReplaysBrowserInput) => {
  const page = useMemo(() => parseReplaysPage(raw), [raw]);
  const [filters, setFilters] = useState<ReplayFilters>(DEFAULT_REPLAY_FILTERS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { pendingFor, draftFor, dismiss, ...prompts } = useReplayPrompts();
  const items = useMemo(() => page?.items ?? [], [page]);
  const visible = useMemo(() => filterReplays({ items, filters, now }), [items, filters, now]);
  const facets = useMemo(() => replayFacets(items), [items]);
  const summary = useMemo(() => summarizeReplays(visible), [visible]);
  const selected = visible.find((item) => item.id === selectedId) ?? visible[0] ?? null;

  return {
    page,
    view: viewOf({ page, raw, enabled, shown: visible.length }),
    filters,
    activeFilters: activeFilterCount(filters),
    items,
    visible,
    facets,
    summary,
    selected,
    pending: pendingFor(selected),
    draft: draftFor(selected),
    patch: (values: FilterPatch) => setFilters((current) => ({ ...current, ...values })),
    sortBy: (sort: ReplaySort) => setFilters(sortedBy(sort)),
    reset: () => setFilters(clearFilters),
    select: (id: string) => {
      setSelectedId(id);
      dismiss();
    },
    ...prompts,
    ...replayCommands
  };
};
