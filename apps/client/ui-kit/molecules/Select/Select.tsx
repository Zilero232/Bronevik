'use client';

import { Select as BaseSelect } from '@base-ui/react/select';
import { clsx } from 'clsx';
import { Check, ChevronsUpDown } from 'lucide-react';

import type { SelectProps } from './Select.types';

import s from './Select.module.scss';

export const Select = <T extends string>({ items, value, label, placeholder, className, onValueChange }: SelectProps<T>) => (
  <BaseSelect.Root items={items} value={value} onValueChange={(next) => next !== null && onValueChange(next)}>
    {label && <BaseSelect.Label className={s.label}>{label}</BaseSelect.Label>}
    <BaseSelect.Trigger className={clsx(s.trigger, className)}>
      <BaseSelect.Value className={s.value} placeholder={placeholder} />
      <BaseSelect.Icon className={s.icon}>
        <ChevronsUpDown size={15} />
      </BaseSelect.Icon>
    </BaseSelect.Trigger>
    <BaseSelect.Portal>
      <BaseSelect.Positioner className={s.positioner} sideOffset={6}>
        <BaseSelect.Popup className={s.popup}>
          <BaseSelect.List className={s.list}>
            {items.map((item) => (
              <BaseSelect.Item key={item.value} className={s.item} value={item.value}>
                <BaseSelect.ItemIndicator className={s.indicator}>
                  <Check size={14} />
                </BaseSelect.ItemIndicator>
                {item.icon && <span className={s.itemIcon}>{item.icon}</span>}
                <BaseSelect.ItemText>{item.label}</BaseSelect.ItemText>
              </BaseSelect.Item>
            ))}
          </BaseSelect.List>
        </BaseSelect.Popup>
      </BaseSelect.Positioner>
    </BaseSelect.Portal>
  </BaseSelect.Root>
);
