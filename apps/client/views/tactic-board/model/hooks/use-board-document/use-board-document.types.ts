import type { HocuspocusProvider } from '@hocuspocus/provider';
import type * as Y from 'yjs';

import type { TacticBoard } from '@/shared/api/tactics';

export type UseBoardDocumentInput = {
  board: TacticBoard;
  urlToken: string | null;
  userName: string | null;
};

export type BoardSession = {
  doc: Y.Doc;
  provider: HocuspocusProvider;
  undo: Y.UndoManager;
};

export type BoardHistory = {
  canUndo: boolean;
  canRedo: boolean;
};
