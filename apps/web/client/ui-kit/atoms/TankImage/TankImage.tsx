'use client';

import { toRoman } from '@otmetki/icons';
import { clsx } from 'clsx';
import Image from 'next/image';

import { useImageFallback } from '@/shared/lib';

import type { TankImageProps } from './TankImage.types';

import { ClassIcon } from '../ClassIcon';
import { TANK_IMAGE } from './TankImage.constants';

import s from './TankImage.module.scss';

export const TankImage = ({
  tank,
  size,
  withTint = size === 'big',
  isPriority = false,
  isDecorative = false,
  withFallback = true,
  className
}: TankImageProps) => {
  const { image, onError } = useImageFallback(tank.images?.[size] ?? null);

  const { width, height, glyph } = TANK_IMAGE[size];

  if (!image && !withFallback) {
    return null;
  }

  return (
    <span
      className={clsx(s.root, s[size], className)}
      data-nation={tank.nation}
      data-premium={tank.isPremium || undefined}
      data-state={image ? 'image' : 'fallback'}
      data-tint={withTint || undefined}
    >
      {image ? (
        <Image
          alt={isDecorative ? '' : tank.name}
          className={s.image}
          height={height}
          priority={isPriority}
          src={image}
          unoptimized={size !== 'big'}
          width={width}
          onError={onError}
        />
      ) : (
        <span
          aria-hidden={isDecorative || undefined}
          aria-label={isDecorative ? undefined : tank.name}
          className={s.fallback}
          role={isDecorative ? undefined : 'img'}
        >
          <ClassIcon size={glyph} tankClass={tank.type} variant={tank.isPremium ? 'premium' : 'regular'} />
          <span aria-hidden className={s.tier}>
            {toRoman(tank.tier)}
          </span>
        </span>
      )}
    </span>
  );
};
