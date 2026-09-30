import type { ReplayFilters, ReplaysPage } from '../../../../../entities/replays';
import type { useReplaysBrowser } from './use-replays-browser';

export type UseReplaysBrowserInput = {
  page: unknown;
  enabled: boolean;
  now: number;
};

export type BrowserView = 'empty' | 'indexing' | 'invalid' | 'list' | 'no_account' | 'nothing' | 'off';

export type PendingKind = 'remove' | 'watch';

export type PendingAction = {
  kind: PendingKind;
  id: string;
};

export type RenameDraft = {
  id: string;
  value: string;
};

export type FilterPatch = Partial<ReplayFilters>;

export type ViewOfInput = {
  page: ReplaysPage | null;
  raw: unknown;
  enabled: boolean;
  shown: number;
};

export type ReplaysBrowserModel = ReturnType<typeof useReplaysBrowser>;
