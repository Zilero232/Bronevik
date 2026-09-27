import type { MapRotationRow } from '../../map-stats.types';
import type { RotationRowInput } from './rotation-row.types';

export const toMapRotationRow = ({ row, arena }: RotationRowInput): MapRotationRow => ({
  arenaId: row.arenaId,
  name: arena?.name ?? row.arenaId,
  slug: arena?.slug ?? null,
  image: arena?.image ?? null,
  camouflageType: arena?.camouflageType ?? null,
  battles: row.battles,
  share: row.share,
  modBattles: row.modBattles,
  replayBattles: row.replayBattles
});
