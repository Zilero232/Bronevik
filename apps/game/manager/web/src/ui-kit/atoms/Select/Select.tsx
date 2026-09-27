import { clsx } from 'clsx';
import { ChevronDown } from 'lucide-react';

import type { SelectProps } from './Select.types';

import s from './Select.module.scss';

export const Select = ({ options, className, ...props }: SelectProps) => (
  <span className={clsx(s.root, className)}>
    <select className={s.select} {...props}>
      {options.map((option) => (
        <option key={option.value} disabled={option.disabled} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    <ChevronDown aria-hidden className={s.icon} />
  </span>
);
