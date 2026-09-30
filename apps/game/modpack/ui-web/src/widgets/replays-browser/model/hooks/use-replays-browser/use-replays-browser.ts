import { useMemo, useState } from 'preact/hooks';

import type { ReplayFilters, ReplayItem, ReplaySort } from '../../../../../entities/replays';
import type { BrowserView, FilterPatch, PendingAction, RenameDraft, UseReplaysBrowserInput, ViewOfInput } from './use-replays-browser.types';

import {
  activeFilterCount,
  clearFilters,
  DEFAULT_REPLAY_FILTERS,
  filterReplays,
  parseReplaysPage,
  replayFacets,
  REPLAYS,
  summarizeReplays
} from '../../../../../entities/replays';
import { useEscapeLayer } from '../../../../../shared/lib/use-escape-layer';
import { openSitePath, runReplayAction } from '../../actions';

const viewOf = ({ page, raw, enabled, shown }: ViewOfInput): BrowserView => {
  if (!enabled) {
    return 'off';
  }

  if (raw === undefined) {
    return 'indexing';
  }

  if (raw === null || page === null) {
    return 'invalid';
  }

  if (page.status === 'no_account') {
    return 'no_account';
  }

  if (page.items.length === 0) {
    return page.status === 'indexing' ? 'indexing' : 'empty';
  }

  return shown === 0 ? 'nothing' : 'list';
};

export const useReplaysBrowser = ({ page: raw, enabled, now }: UseReplaysBrowserInput) => {
  const page = useMemo(() => parseReplaysPage(raw), [raw]);
  const [filters, setFilters] = useState<ReplayFilters>(DEFAULT_REPLAY_FILTERS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pending, setPending] = useState<PendingAction | null>(null);
  const [draft, setDraft] = useState<RenameDraft | null>(null);

  useEscapeLayer({ kind: 'confirm', active: pending !== null, onEscape: () => setPending(null) });
  useEscapeLayer({ kind: 'field', active: draft !== null, onEscape: () => setDraft(null) });

  const items = useMemo(() => page?.items ?? [], [page]);
  const visible = useMemo(() => filterReplays({ items, filters, now }), [items, filters, now]);
  const facets = useMemo(() => replayFacets(items), [items]);
  const summary = useMemo(() => summarizeReplays(visible), [visible]);
  const selected = visible.find((item) => item.id === selectedId) ?? visible[0] ?? null;

  const patch = (values: FilterPatch): void => setFilters((current) => ({ ...current, ...values }));

  const ask = (action: PendingAction): void => {
    setDraft(null);
    setPending(action);
  };

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
    pending: pending && pending.id === selected?.id ? pending.kind : null,
    draft: draft && draft.id === selected?.id ? draft.value : null,
    patch,
    sortBy: (sort: ReplaySort) =>
      setFilters((current) => (current.sort === sort ? { ...current, descending: !current.descending } : { ...current, sort, descending: true })),
    reset: () => setFilters(clearFilters),
    select: (id: string) => {
      setSelectedId(id);
      setPending(null);
      setDraft(null);
    },
    toggleFavourite: (item: ReplayItem) =>
      runReplayAction({ action: REPLAYS.actions.favourite, row: item.id, value: item.favourite ? REPLAYS.favouriteOff : REPLAYS.favouriteOn }),
    askWatch: (item: ReplayItem) => ask({ kind: 'watch', id: item.id }),
    askRemove: (item: ReplayItem) => ask({ kind: 'remove', id: item.id }),
    confirm: () => {
      if (pending) {
        runReplayAction({ action: pending.kind === 'watch' ? REPLAYS.actions.play : REPLAYS.actions.remove, row: pending.id });
      }

      setPending(null);
    },
    cancel: () => setPending(null),
    startRename: (item: ReplayItem) => {
      setPending(null);
      setDraft({ id: item.id, value: item.title });
    },
    editRename: (value: string) => setDraft((current) => (current ? { ...current, value } : current)),
    submitRename: () => {
      if (draft && draft.value.trim() !== '') {
        runReplayAction({ action: REPLAYS.actions.rename, row: draft.id, value: draft.value.trim() });
      }

      setDraft(null);
    },
    cancelRename: () => setDraft(null),
    upload: (item: ReplayItem) => runReplayAction({ action: REPLAYS.actions.upload, row: item.id }),
    openSite: (item: ReplayItem) => {
      if (item.site?.link) {
        openSitePath(item.site.link);
      }
    },
    openSiteList: () => openSitePath(REPLAYS.siteListPath),
    refresh: () => runReplayAction({ action: REPLAYS.actions.refresh }),
    openFolder: () => runReplayAction({ action: REPLAYS.actions.folder })
  };
};
