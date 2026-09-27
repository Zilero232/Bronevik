import type { LiveValueInput, ParsedTank } from '../../lib';

export type ToChangeRowsInput = {
  tank: ParsedTank;
  stats: LiveValueInput['stats'];
};
