import type { TacticBoard } from '@/shared/api/tactics';

export type SharePanelProps = {
  board: TacticBoard;
  token: string | null;
};
