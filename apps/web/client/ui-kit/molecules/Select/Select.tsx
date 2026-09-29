'use client';

import { Select as BaseSelect } from '@base-ui/react/select';
import { clsx } from 'clsx';
import { Check, ChevronsUpDown } from 'lucide-react';

import { useFormControl } from '@/shared/lib';

import type { SelectProps } from './Select.types';

import s from './Select.module.scss';

export const Select = <T extends string>({ items, value, label, placeholder, className, 'aria-label': ariaLabel, onValueChange }: SelectProps<T>) => {
  const control = useFormControl();

  return (
    <BaseSelect.Root items={items} value={value} onValueChange={(next) => next !== null && onValueChange(next)}>
      <div className={clsx(s.field, label && s.labelled, label && className)}>
        {label && <BaseSelect.Label className={s.label}>{label}</BaseSelect.Label>}
        <BaseSelect.Trigger {...control} aria-label={ariaLabel} className={clsx(s.trigger, !label && className)}>
          <BaseSelect.Value className={s.value} placeholder={placeholder} />
          <BaseSelect.Icon className={s.icon}>
            <ChevronsUpDown size={15} />
          </BaseSelect.Icon>
        </BaseSelect.Trigger>
      </div>
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
};
