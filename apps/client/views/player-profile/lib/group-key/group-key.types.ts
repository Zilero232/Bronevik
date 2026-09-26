import type { TankClass, Tier } from '@otmetki/icons';

export type GroupKey = { kind: 'class'; type: TankClass } | { kind: 'raw'; key: string } | { kind: 'tier'; tier: Tier };
