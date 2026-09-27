import { HeavyTankSilhouetteIcon } from '@otmetki/icons';
import { Inbox } from 'lucide-react';

import type { EmptyArtProps } from './EmptyArt.types';

import s from './EmptyArt.module.scss';

export const EmptyArt = ({ icon }: EmptyArtProps) => (
  <span aria-hidden className={s.root}>
    <svg className={s.frame} viewBox='0 0 96 84'>
      <path className={s.hex} d='M25 2h46l23 40-23 40H25L2 42Z' />
      <path className={s.ring} d='M29 10h38l19 32-19 32H29L10 42Z' />
      <path className={s.ground} d='M18 62h60' />
    </svg>
    <HeavyTankSilhouetteIcon className={s.tank} size={44} />
    <span className={s.badge}>{icon ?? <Inbox size={14} />}</span>
  </span>
);
