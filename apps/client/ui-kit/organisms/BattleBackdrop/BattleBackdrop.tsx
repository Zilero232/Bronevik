'use client';

import { clsx } from 'clsx';

import { useBattleBackdrop } from '@/shared/lib';

import type { BattleBackdropProps } from './BattleBackdrop.types';

import s from './BattleBackdrop.module.scss';

export const BattleBackdrop = ({ tone = 'neutral', nation, seed = 1, density = 'normal', className }: BattleBackdropProps) => {
  const { rootRef, fieldRef, motionRef } = useBattleBackdrop({ seed, density });

  return (
    <div aria-hidden ref={rootRef} className={clsx(s.root, className)} data-nation={nation} data-tone={tone}>
      <canvas ref={fieldRef} className={s.layer} />
      <canvas ref={motionRef} className={s.layer} />
    </div>
  );
};
