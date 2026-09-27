'use client';

import { popularLoadout } from '@/entities/tank/build';

import type { UsePresetCardInput } from './use-preset-card.types';

import { toBuildItem } from '../../../lib/build-catalog';
import { sameLoadout } from '../../../lib/loadout-edit';
import { useBuildContext } from '../../context';

export const usePresetCard = ({ preset }: UsePresetCardInput) => {
  const { catalog, active, side, edit } = useBuildContext();

  const loadout = {
    ...popularLoadout(preset),
    profileId: active.profileId,
    crewSkills: active.crewSkills,
    fieldModifications: active.fieldModifications
  };

  const onApply = () => edit(() => loadout);

  return {
    side,
    equipment: preset.optionalDevices.map(toBuildItem),
    isActive: sameLoadout({ a: active, b: loadout, modules: catalog.modules }),
    onApply
  };
};
