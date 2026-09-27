import type { CompetitionWithSummary } from '../../selects';

export type ToCompetitionSummaryInput = {
  row: CompetitionWithSummary;
  now: Date;
};
