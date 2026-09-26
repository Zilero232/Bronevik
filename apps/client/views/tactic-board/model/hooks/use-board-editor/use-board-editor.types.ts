import type { TacticBoardRole } from '@/shared/api/tactics';

import type { useBoardDocument } from '../use-board-document';

export type UseBoardEditorInput = {
  document: ReturnType<typeof useBoardDocument>;
  role: TacticBoardRole;
};
