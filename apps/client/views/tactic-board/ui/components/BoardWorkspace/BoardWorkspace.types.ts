import type { TacticBoard } from '@/shared/api/tactics';

export type BoardWorkspaceProps = {
  board: TacticBoard;
  urlToken: string | null;
};
