'use client';

import { toRoman } from '@otmetki/icons';
import { useBoolean } from '@siberiacancode/reactuse';
import { clsx } from 'clsx';
import Image from 'next/image';

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
  const [hasFailed, setFailed] = useBoolean(false);

  const src = tank.images?.[size] ?? null;
  const { width, height, glyph } = TANK_IMAGE[size];
  const isImage = src !== null && !hasFailed;

  if (!isImage && !withFallback) {
    return null;
  }

  return (
    <span
      className={clsx(s.root, s[size], className)}
      data-nation={tank.nation}
      data-premium={tank.isPremium || undefined}
      data-state={isImage ? 'image' : 'fallback'}
      data-tint={withTint || undefined}
    >
      {isImage ? (
        <Image
          alt={isDecorative ? '' : tank.name}
          className={s.image}
          height={height}
          priority={isPriority}
          src={src}
          unoptimized={size !== 'big'}
          width={width}
          onError={() => setFailed(true)}
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
