import type { ReplaysPage } from '../../../../entities/replays';

export type BrowserView = 'empty' | 'indexing' | 'invalid' | 'list' | 'no_account' | 'nothing' | 'off';

export type ViewOfInput = {
  page: ReplaysPage | null;
  raw: unknown;
  enabled: boolean;
  shown: number;
};
