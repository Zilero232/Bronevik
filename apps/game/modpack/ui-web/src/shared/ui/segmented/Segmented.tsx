import clsx from 'clsx';

import type { SegmentedProps } from './Segmented.types';

import s from './Segmented.module.scss';

export const Segmented = <T extends string>({ label, items, value, wrap = false, className, onSelect }: SegmentedProps<T>) => (
  <div aria-label={label} className={clsx(s.segmented, wrap && s.wrap, className)} role='group'>
    {items.map((item) => (
      <button
        key={item.value}
        aria-pressed={item.value === value}
        className={clsx(s.item, item.value === value && s.itemOn)}
        type='button'
        onClick={() => onSelect(item.value)}
      >
        {item.label}
      </button>
    ))}
  </div>
);
