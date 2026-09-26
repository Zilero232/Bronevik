'use client';

import { Radio } from '@base-ui/react/radio';
import { RadioGroup } from '@base-ui/react/radio-group';
import { clsx } from 'clsx';

import type { SegmentedControlProps } from './SegmentedControl.types';

import s from './SegmentedControl.module.scss';

export const SegmentedControl = <T extends string>({
  options,
  value,
  size = 'md',
  className,
  'aria-label': ariaLabel,
  onChange
}: SegmentedControlProps<T>) => (
  <RadioGroup<T> aria-label={ariaLabel} className={clsx(s.root, s[size], className)} value={value} onValueChange={onChange}>
    {options.map((option) => {
      const isActive = option.value === value;

      return (
        <Radio.Root<T>
          nativeButton
          key={option.value}
          aria-label={option['aria-label']}
          className={s.option}
          data-active={isActive}
          render={<button type='button' />}
          value={option.value}
        >
          {option.icon && (
            <span aria-hidden className={s.icon}>
              {option.icon}
            </span>
          )}
          <span className={s.label}>{option.label}</span>
        </Radio.Root>
      );
    })}
  </RadioGroup>
);
