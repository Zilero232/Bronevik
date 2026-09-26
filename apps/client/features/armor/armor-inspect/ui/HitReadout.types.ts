import type { ArmorPieceKind } from '@bronevik/gamedata';

import type { HitReport } from '../lib/hit-report';

export type HitReadoutProps = {
  report: HitReport;
  pieceKind: ArmorPieceKind;
};
