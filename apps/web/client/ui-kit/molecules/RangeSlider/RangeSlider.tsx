'use client';

import { Slider } from '@base-ui/react/slider';
import { clsx } from 'clsx';
import { useLocale } from 'next-intl';

import type { RangeSliderProps } from './RangeSlider.types';

import s from './RangeSlider.module.scss';

export const RangeSlider = ({ value, label, min, max, step = 1, valueLabel, className, onValueChange }: RangeSliderProps) => {
  const locale = useLocale();

  return (
    <Slider.Root
      className={clsx(s.root, className)}
      locale={locale}
      max={max}
      min={min}
      step={step}
      value={value}
      onValueChange={(next) => onValueChange(Array.isArray(next) ? (next[0] ?? min) : next)}
    >
      <div className={s.head}>
        <Slider.Label className={s.label}>{label}</Slider.Label>
        <span className={s.value}>{valueLabel ?? <Slider.Value />}</span>
      </div>
      <Slider.Control className={s.control}>
        <Slider.Track className={s.track}>
          <Slider.Indicator className={s.indicator} />
          <Slider.Thumb className={s.thumb} />
        </Slider.Track>
      </Slider.Control>
    </Slider.Root>
  );
};
