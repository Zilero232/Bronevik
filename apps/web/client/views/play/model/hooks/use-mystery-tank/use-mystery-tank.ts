'use client';

import { vehicleIdentity } from '@/entities/tank/tank';

import { silhouetteBlur } from '../../../lib/silhouette-blur';
import { useGuessGame } from '../../context';

export const useMysteryTank = () => {
  const { target, clueCount, status } = useGuessGame();

  const isOver = status !== 'playing';

  return {
    status,
    isOver,
    identity: vehicleIdentity(target),
    tankClass: target.type,
    blur: `blur(${silhouetteBlur({ clueCount, isOver })}px)`
  };
};
