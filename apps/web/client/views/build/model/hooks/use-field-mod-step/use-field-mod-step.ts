'use client';

import type { UseFieldModStepInput } from './use-field-mod-step.types';

import { chooseFieldMod, fieldModSide } from '../../../lib/loadout-edit';
import { useBuildContext } from '../../context';

export const useFieldModStep = ({ step }: UseFieldModStepInput) => {
  const { catalog, active, edit } = useBuildContext();

  const chosen = fieldModSide({ loadout: active, step });

  const onChoose = (tag: string) => () => edit((loadout) => chooseFieldMod({ loadout, steps: catalog.fieldSteps, tag }));

  return { chosen, onChoose };
};
