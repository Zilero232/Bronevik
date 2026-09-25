'use client';

import { NumberField as BaseNumberField } from '@base-ui/react/number-field';
import { clsx } from 'clsx';
import { Minus, Plus } from 'lucide-react';
import { useId } from 'react';

import type { NumberFieldProps } from './NumberField.types';

import s from './NumberField.module.scss';

export const NumberField = ({ value, label, min, max, step = 1, suffix, hint, format, className, onValueChange }: NumberFieldProps) => {
  const id = useId();

  return (
    <BaseNumberField.Root
      className={clsx(s.root, className)}
      format={format}
      id={id}
      max={max}
      min={min}
      step={step}
      value={value}
      onValueChange={onValueChange}
    >
      <label className={s.label} htmlFor={id}>
        {label}
      </label>
      <BaseNumberField.Group className={s.group}>
        <BaseNumberField.Decrement aria-label='−' className={s.step}>
          <Minus size={14} />
        </BaseNumberField.Decrement>
        <BaseNumberField.Input className={s.input} />
        {suffix && <span className={s.suffix}>{suffix}</span>}
        <BaseNumberField.Increment aria-label='+' className={s.step}>
          <Plus size={14} />
        </BaseNumberField.Increment>
      </BaseNumberField.Group>
      {hint && <span className={s.hint}>{hint}</span>}
    </BaseNumberField.Root>
  );
};
