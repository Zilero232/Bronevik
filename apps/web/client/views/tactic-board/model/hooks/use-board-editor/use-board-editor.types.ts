import type { TacticBoardRole } from '@/entities/tactic/board';

import type { useBoardDocument } from '../use-board-document';

export type UseBoardEditorInput = {
  document: ReturnType<typeof useBoardDocument>;
  role: TacticBoardRole;
};
