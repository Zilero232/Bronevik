import type { BattleResultEvent } from '../../lib/contract';

export type ModShot = NonNullable<BattleResultEvent['shots']>[number];
