import type { TacticBoard } from '@/entities/tactic/board';

export type BoardSettingsDialogProps = {
  board: TacticBoard;
  token: string | null;
};
