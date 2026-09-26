'use client';

import { useBoolean } from '@siberiacancode/reactuse';
import { clsx } from 'clsx';
import Image from 'next/image';

import type { GameIconProps } from './GameIcon.types';

import s from './GameIcon.module.scss';

export const GameIcon = ({ src, size, className }: GameIconProps) => {
  const [hasFailed, setFailed] = useBoolean(false);

  if (!src || hasFailed) {
    return null;
  }

  return <Image unoptimized alt='' className={clsx(s.root, className)} height={size} src={src} width={size} onError={() => setFailed(true)} />;
};
