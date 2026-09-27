import clsx from 'clsx';

import type { SegmentedProps } from './Segmented.types';

import s from './Segmented.module.scss';

export const Segmented = <T extends string>({ items, value, wrap = false, className, onSelect }: SegmentedProps<T>) => (
  <div className={clsx(s.segmented, wrap && s.wrap, className)}>
    {items.map((item) => (
      <button key={item.value} className={clsx(s.item, item.value === value && s.itemOn)} type='button' onClick={() => onSelect(item.value)}>
        {item.label}
      </button>
    ))}
  </div>
);
