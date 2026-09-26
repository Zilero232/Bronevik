'use client';

import { useBoolean } from '@siberiacancode/reactuse';
import { clsx } from 'clsx';
import Image from 'next/image';

import type { GameIconProps } from './GameIcon.types';

import { GAME_ICON, GAME_ICON_FALLBACK } from '../../config';

import s from './GameIcon.module.scss';

export const GameIcon = ({ src, size, kind, className }: GameIconProps) => {
  const [hasFailed, setFailed] = useBoolean(false);

  if (!src || hasFailed) {
    const Glyph = GAME_ICON_FALLBACK[kind];

    return (
      <span aria-hidden className={clsx(s.root, s.fallback, className)} data-kind={kind} style={{ width: size, height: size }}>
        <Glyph size={Math.round(size * GAME_ICON.glyphRatio)} strokeWidth={1.75} />
      </span>
    );
  }

  return <Image unoptimized alt='' className={clsx(s.root, className)} height={size} src={src} width={size} onError={() => setFailed(true)} />;
};
