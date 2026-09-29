import { NumberField } from '@base-ui/react/number-field';
import { Minus, Plus } from 'lucide-react';

import type { TimeSpinProps } from './TimeSpin.types';

import { DATE_TIME_FIELD_VIEW } from '../../DateTimeField.constants';

import s from './TimeSpin.module.scss';

export const TimeSpin = ({ value, min, max, step, label, decrementLabel, incrementLabel, onValueChange }: TimeSpinProps) => (
  <NumberField.Root
    className={s.root}
    format={DATE_TIME_FIELD_VIEW.twoDigits}
    max={max}
    min={min}
    step={step}
    value={value}
    onValueChange={onValueChange}
  >
    <NumberField.Decrement aria-label={decrementLabel} className={s.step}>
      <Minus size={DATE_TIME_FIELD_VIEW.stepIconSize} />
    </NumberField.Decrement>
    <NumberField.Input aria-label={label} className={s.input} placeholder={DATE_TIME_FIELD_VIEW.emptyTime} />
    <NumberField.Increment aria-label={incrementLabel} className={s.step}>
      <Plus size={DATE_TIME_FIELD_VIEW.stepIconSize} />
    </NumberField.Increment>
  </NumberField.Root>
);
