import type { BattlePassPlanInput } from '../../../lib/battle-pass';

type NullableFields = Omit<BattlePassPlanInput, 'battlesPerDay' | 'today'>;

export type BattlePassValues = { [K in keyof NullableFields]: NullableFields[K] | null } & Pick<BattlePassPlanInput, 'battlesPerDay'>;
