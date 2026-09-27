import type { TacticBoard } from '@/entities/tactic/board';

export type BoardHeaderProps = {
  board: TacticBoard;
  token: string | null;
};
