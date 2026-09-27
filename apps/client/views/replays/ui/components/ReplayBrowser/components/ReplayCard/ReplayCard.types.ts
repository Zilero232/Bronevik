import type { VehicleSummary } from '@otmetki/schemas';

import type { Replay } from '@/entities/replay/replay';

export type ReplayCardProps = {
  replay: Replay;
  vehicle: VehicleSummary | null;
};
