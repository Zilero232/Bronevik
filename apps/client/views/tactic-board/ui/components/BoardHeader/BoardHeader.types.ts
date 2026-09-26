import type { TacticBoard } from '@/shared/api/tactics';

export type BoardHeaderProps = {
  board: TacticBoard;
  token: string | null;
};
