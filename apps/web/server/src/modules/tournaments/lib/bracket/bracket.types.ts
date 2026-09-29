import type { z } from 'zod';

import type { bracketSchema } from '../../dto/tournaments.schemas';

export type Bracket = z.infer<typeof bracketSchema>;

export type BracketMatch = Bracket['rounds'][number][number];

export type ReportWinnerInput = Pick<BracketMatch, 'index' | 'round'> & {
  bracket: Bracket;
  winner: number;
};

export type PlaceWinnerInput = Pick<Bracket, 'rounds'> & Pick<BracketMatch, 'index' | 'round' | 'winner'>;
