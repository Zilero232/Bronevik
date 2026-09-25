'use client';

import { NumberField } from '@/ui-kit';

import type { FieldGridProps } from './CalcKit.types';

import s from './CalcKit.module.scss';

export const FieldGrid = <K extends string>({ fields, values, onChange }: FieldGridProps<K>) => (
  <div className={s.fields}>
    {fields.map(({ key, label, min, max, step, suffix, hint }) => (
      <NumberField
        key={key}
        hint={hint}
        label={label}
        max={max}
        min={min}
        step={step}
        suffix={suffix}
        value={values[key]}
        onValueChange={(value) => onChange({ key, value })}
      />
    ))}
  </div>
);
