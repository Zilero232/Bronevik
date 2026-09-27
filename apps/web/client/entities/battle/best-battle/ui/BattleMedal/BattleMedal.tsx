import { clsx } from 'clsx';
import Image from 'next/image';

import type { BattleMedalProps } from './BattleMedal.types';

import { BEST_BATTLE } from '../../config';

import s from './BattleMedal.module.scss';

export const BattleMedal = ({ medal, size = BEST_BATTLE.medalSize, className }: BattleMedalProps) =>
  medal.image ? (
    <Image unoptimized alt={medal.title} className={clsx(s.root, className)} height={size} src={medal.image} title={medal.title} width={size} />
  ) : (
    <span className={clsx(s.root, s.fallback, className)} style={{ inlineSize: size, blockSize: size }} title={medal.title}>
      {medal.title.slice(0, 1)}
    </span>
  );
