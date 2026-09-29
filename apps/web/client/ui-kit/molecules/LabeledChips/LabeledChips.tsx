'use client';

import type { LabeledChipsProps } from './LabeledChips.types';

import { ToggleChips } from '../ToggleChips';

import s from './LabeledChips.module.scss';

export const LabeledChips = <T extends string>({ label, ...chips }: LabeledChipsProps<T>) => (
  <div className={s.root}>
    <span aria-hidden className={s.label}>
      {label}
    </span>
    <ToggleChips<T> aria-label={label} {...chips} />
  </div>
);
