'use client';

import { Toggle } from '@base-ui/react/toggle';
import { ToggleGroup } from '@base-ui/react/toggle-group';
import { clsx } from 'clsx';

import { useIconFilter } from '@/shared/lib';

import type { IconFilterKind, IconFilterProps } from './IconFilter.types';

import { IconFilterGlyph } from './components';

import s from './IconFilter.module.scss';

export const IconFilter = <K extends IconFilterKind>({
  kind,
  options,
  value,
  isMultiple = true,
  size = 'md',
  className,
  'aria-label': ariaLabel,
  onChange
}: IconFilterProps<K>) => {
  const { titleOf, selected, onValueChange } = useIconFilter({ options, value, isMultiple, onChange });

  return (
    <ToggleGroup
      aria-label={ariaLabel}
      className={clsx(s.root, s[kind], s[size], className)}
      multiple={isMultiple}
      value={selected}
      onValueChange={onValueChange}
    >
      {options.map((option) => (
        <Toggle
          key={String(option)}
          aria-label={titleOf(option)}
          className={s.chip}
          data-class={kind === 'class' ? option : undefined}
          title={titleOf(option)}
          value={String(option)}
        >
          <IconFilterGlyph value={option} />
        </Toggle>
      ))}
    </ToggleGroup>
  );
};
