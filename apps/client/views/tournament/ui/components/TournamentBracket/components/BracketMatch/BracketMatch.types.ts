import type { ReportMatchInput } from '@/shared/api/tournaments';

import type { BracketMatchView } from '../../../../../lib/bracket-columns';

export type BracketMatchProps = {
  match: BracketMatchView;
  canReport: boolean;
  isReporting: boolean;
  onReport: (input: Omit<ReportMatchInput, 'id'>) => void;
};
