import type { FieldModification } from '@bronevik/gamedata';
import type { ProvisionOption } from '@bronevik/schemas';

export type FieldModificationStepsInput = {
  tree: unknown;
  pairs: readonly unknown[];
  modifications: readonly FieldModification[];
  tier: number;
  optionOf: (name: string) => ProvisionOption | undefined;
};
