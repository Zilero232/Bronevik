'use client';

import { Toggle } from '@base-ui/react/toggle';
import { ToggleGroup } from '@base-ui/react/toggle-group';
import { clsx } from 'clsx';

import type { ToggleChipsProps } from './ToggleChips.types';

import s from './ToggleChips.module.scss';

export const ToggleChips = <T extends string>({ options, value, size = 'md', className, 'aria-label': ariaLabel, onChange }: ToggleChipsProps<T>) => (
  <ToggleGroup
    multiple
    aria-label={ariaLabel}
    className={clsx(s.root, s[size], className)}
    value={[...value]}
    onValueChange={(next) => onChange(options.filter((option) => next.includes(option.value)).map((option) => option.value))}
  >
    {options.map((option) => (
      <Toggle key={option.value} aria-label={option.title} className={s.chip} title={option.title} value={option.value}>
        {option.icon && (
          <span aria-hidden className={s.icon}>
            {option.icon}
          </span>
        )}
        {option.label}
      </Toggle>
    ))}
  </ToggleGroup>
);
