'use client';

import { Radio } from '@base-ui/react/radio';
import { RadioGroup } from '@base-ui/react/radio-group';
import { clsx } from 'clsx';
import * as m from 'motion/react-m';
import { useId } from 'react';

import type { SegmentedControlProps } from './SegmentedControl.types';

import { SEGMENTED_CONTROL } from './SegmentedControl.constants';

import s from './SegmentedControl.module.scss';

export const SegmentedControl = <T extends string>({
  options,
  value,
  size = 'md',
  variant = 'text',
  className,
  'aria-label': ariaLabel,
  onChange
}: SegmentedControlProps<T>) => {
  const indicatorId = useId();

  return (
    <RadioGroup<T> aria-label={ariaLabel} className={clsx(s.root, s[size], s[variant], className)} value={value} onValueChange={onChange}>
      {options.map((option) => {
        const isActive = option.value === value;

        return (
          <Radio.Root<T>
            nativeButton
            key={option.value}
            aria-label={option['aria-label']}
            className={s.option}
            data-active={isActive}
            data-class={option.tint}
            render={<button type='button' />}
            value={option.value}
          >
            {option.icon && (
              <span aria-hidden className={s.icon}>
                {option.icon}
              </span>
            )}
            <span className={s.label}>{option.label}</span>
            {variant === 'icons' && isActive && (
              <m.span aria-hidden className={s.indicator} layoutId={indicatorId} transition={SEGMENTED_CONTROL.slide} />
            )}
          </Radio.Root>
        );
      })}
    </RadioGroup>
  );
};
