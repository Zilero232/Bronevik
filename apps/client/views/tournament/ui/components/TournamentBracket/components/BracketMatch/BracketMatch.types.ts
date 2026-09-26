import type { ReportMatchInput } from '@/entities/tournament/tournament';

import type { BracketMatchView } from '../../../../../lib/bracket-columns';

export type BracketMatchProps = {
  match: BracketMatchView;
  canReport: boolean;
  isReporting: boolean;
  onReport: (input: Omit<ReportMatchInput, 'id'>) => void;
};
