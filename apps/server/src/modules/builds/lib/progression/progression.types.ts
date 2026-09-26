import type { FieldModification } from '@otmetki/gamedata';
import type { ProvisionOption } from '@otmetki/schemas';

export type FieldModificationStepsInput = {
  tree: unknown;
  pairs: readonly unknown[];
  modifications: readonly FieldModification[];
  tier: number;
  optionOf: (name: string) => ProvisionOption | undefined;
};
