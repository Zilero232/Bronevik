import type { FieldModificationStep } from '@otmetki/schemas';

import type { FieldModificationStepsInput } from './progression.types';

import { resolveVehicleProgression } from '../../../gamedata';
import { modificationPairSchema, progressionTreeSchema } from './progression.schemas';

export const fieldModificationSteps = ({ tree, pairs, modifications, tier, optionOf }: FieldModificationStepsInput): FieldModificationStep[] => {
  const parsedTree = progressionTreeSchema.safeParse(tree);

  if (!parsedTree.success) {
    return [];
  }

  const steps = resolveVehicleProgression({
    progression: {
      trees: [parsedTree.data],
      modifications: [...modifications],
      pairs: pairs.flatMap((pair) => {
        const parsed = modificationPairSchema.safeParse(pair);

        return parsed.success ? [parsed.data] : [];
      }),
      features: [],
      prices: {}
    },
    treeName: parsedTree.data.name,
    vehicleTier: tier
  });

  return steps.flatMap((step): FieldModificationStep[] => {
    if (step.modification) {
      const option = optionOf(step.modification.name);

      return option ? [{ level: step.level, kind: 'modification', options: [option] }] : [];
    }

    if (step.pair) {
      const options = step.pair.flatMap((modification) => optionOf(modification.name) ?? []);

      return options.length > 0 ? [{ level: step.level, kind: 'pair', options }] : [];
    }

    return [];
  });
};
