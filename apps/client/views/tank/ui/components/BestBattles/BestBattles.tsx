'use client';

import { TankBestBattles } from '@/widgets/tank/tank-best-battles';

import { useTank } from '../../../model/context';

export const BestBattles = () => {
  const { tankId } = useTank();

  return <TankBestBattles tankId={tankId} />;
};
