'use client';

import type { Vec3 } from '@otmetki/gamedata';

import type { UseHologramStageInput } from './use-hologram-stage.types';

import { useHologramRig } from '../use-hologram-rig';
import { useTurntable } from '../use-turntable';

export const useHologramStage = ({ rig, sweep, isLive, drag }: UseHologramStageInput) => {
  const built = useHologramRig(rig);
  const { rootRef, turretRef } = useTurntable({ rig, materials: built.materials, sweep, isLive, drag });
  const offset: Vec3 = [-rig.center[0], -rig.floor, -rig.center[2]];

  return { ...built, rootRef, turretRef, offset };
};
