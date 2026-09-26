import type { TacticBoard } from '@/entities/tactic/board';

export type BoardWorkspaceProps = {
  board: TacticBoard;
  urlToken: string | null;
};
