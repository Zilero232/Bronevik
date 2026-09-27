'use client';

import { TankMath } from '@/widgets/tank/tank-math';

import { TANK_SECTIONS } from '../../../config';
import { useTank } from '../../../model/context';

export const MathSection = () => {
  const { tankId } = useTank();

  return <TankMath id={TANK_SECTIONS.math} tankId={tankId} />;
};
