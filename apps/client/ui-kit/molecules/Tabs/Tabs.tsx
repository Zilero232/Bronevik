'use client';

import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { clsx } from 'clsx';

import type { TabsProps } from './Tabs.types';

import s from './Tabs.module.scss';

export const Tabs = <T extends string>({
  items,
  value,
  defaultValue,
  variant = 'strip',
  aside,
  className,
  panelClassName,
  'aria-label': ariaLabel,
  isKeptMounted = false,
  onValueChange
}: TabsProps<T>) => (
  <BaseTabs.Root
    className={clsx(s.root, s[variant], className)}
    data-panels={items.some((item) => item.content !== undefined)}
    defaultValue={defaultValue ?? items[0]?.value}
    value={value}
    onValueChange={(next: T) => onValueChange?.(next)}
  >
    <div className={s.bar}>
      <BaseTabs.List aria-label={ariaLabel} className={s.list}>
        {items.map((item) => (
          <BaseTabs.Tab key={item.value} className={s.tab} value={item.value}>
            {item.icon && <span className={s.icon}>{item.icon}</span>}
            {item.label}
            {item.count !== undefined && <span className={s.count}>{item.count}</span>}
          </BaseTabs.Tab>
        ))}
        {variant === 'sticky' && <BaseTabs.Indicator className={s.indicator} />}
      </BaseTabs.List>
      {aside && <div className={s.aside}>{aside}</div>}
    </div>
    {items.map(
      (item) =>
        item.content !== undefined && (
          <BaseTabs.Panel key={item.value} className={clsx(s.content, panelClassName)} keepMounted={isKeptMounted} value={item.value}>
            {item.content}
          </BaseTabs.Panel>
        )
    )}
  </BaseTabs.Root>
);
