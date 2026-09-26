'use client';

import { useBoolean } from '@siberiacancode/reactuse';
import { clsx } from 'clsx';
import Image from 'next/image';

import type { ClanEmblemProps } from './ClanEmblem.types';

import { CLAN_EMBLEM } from '../../config';

import s from './ClanEmblem.module.scss';

export const ClanEmblem = ({ tag, src, size = 'sm', color, className }: ClanEmblemProps) => {
  const [hasFailed, setFailed] = useBoolean(false);

  const pixels = CLAN_EMBLEM.size[size];
  const isImage = Boolean(src) && !hasFailed;

  return (
    <span
      className={clsx(s.root, className)}
      data-state={isImage ? 'image' : 'fallback'}
      style={{ width: pixels, height: pixels, borderColor: color ?? undefined }}
    >
      {isImage && src ? (
        <Image unoptimized alt={tag} className={s.image} height={pixels} src={src} width={pixels} onError={() => setFailed(true)} />
      ) : (
        <span aria-label={tag} className={s.fallback} role='img'>
          {tag.slice(0, CLAN_EMBLEM.fallbackLetters)}
        </span>
      )}
    </span>
  );
};
