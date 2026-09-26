import type { SessionTankDelta } from '@otmetki/schemas';

export type SessionHighlightsProps = {
  best: SessionTankDelta | null;
  worst: SessionTankDelta | null;
};
