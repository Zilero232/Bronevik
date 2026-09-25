import type * as Y from 'yjs';

import type { TacticBoardData } from '../../community.types';

export type SeedBoardInput = {
  document: Y.Doc;
  data: TacticBoardData;
};

export type RestoreBoardInput = {
  document: Y.Doc;
  state: Uint8Array;
};

export type DocumentNameInput = {
  prefix: string;
  id: string;
};

export type BoardIdOfInput = {
  prefix: string;
  name: string;
};
