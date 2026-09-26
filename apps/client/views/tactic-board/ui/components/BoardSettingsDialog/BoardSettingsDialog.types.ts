import type { TacticBoard } from '@/shared/api/tactics';

export type BoardSettingsDialogProps = {
  board: TacticBoard;
  token: string | null;
};
