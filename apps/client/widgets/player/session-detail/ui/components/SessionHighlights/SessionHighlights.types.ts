import type { SessionTankDelta } from '@bronevik/schemas';

export type SessionHighlightsProps = {
  best: SessionTankDelta | null;
  worst: SessionTankDelta | null;
};
