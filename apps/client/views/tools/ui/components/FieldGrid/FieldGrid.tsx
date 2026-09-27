import { NumberField } from '@/ui-kit';

import type { FieldGridProps } from './FieldGrid.types';

import s from './FieldGrid.module.scss';

export const FieldGrid = <K extends string>({ fields, values, field }: FieldGridProps<K>) => (
  <div className={s.root}>
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
        onValueChange={field(key)}
      />
    ))}
  </div>
);
