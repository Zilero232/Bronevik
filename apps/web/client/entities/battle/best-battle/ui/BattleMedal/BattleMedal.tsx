'use client';

import { clsx } from 'clsx';
import Image from 'next/image';

import { useImageFallback } from '@/shared/lib';

import type { BattleMedalProps } from './BattleMedal.types';

import { BEST_BATTLE } from '../../config';

import s from './BattleMedal.module.scss';

export const BattleMedal = ({ medal, size = BEST_BATTLE.medalSize, className }: BattleMedalProps) => {
  const { image, onError } = useImageFallback([medal.image]);

  return image ? (
    <Image
      unoptimized
      alt={medal.title}
      className={clsx(s.root, className)}
      height={size}
      src={image}
      title={medal.title}
      width={size}
      onError={onError}
    />
  ) : (
    <span className={clsx(s.root, s.fallback, className)} style={{ inlineSize: size, blockSize: size }} title={medal.title}>
      {medal.title.slice(0, 1)}
    </span>
  );
};
