'use client';

import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { clsx } from 'clsx';

import type { TabsProps } from './Tabs.types';

import s from './Tabs.module.scss';

export const Tabs = <T extends string>({ items, value, defaultValue, className, panelClassName, onValueChange }: TabsProps<T>) => (
  <BaseTabs.Root
    className={clsx(s.root, className)}
    defaultValue={defaultValue ?? items[0]?.value}
    value={value}
    onValueChange={(next: T) => onValueChange?.(next)}
  >
    <BaseTabs.List className={s.list}>
      {items.map((item) => (
        <BaseTabs.Tab key={item.value} className={s.tab} value={item.value}>
          {item.icon && <span className={s.icon}>{item.icon}</span>}
          {item.label}
          {item.count !== undefined && <span className={s.count}>{item.count}</span>}
        </BaseTabs.Tab>
      ))}
      <BaseTabs.Indicator className={s.indicator} />
    </BaseTabs.List>
    {items.map(
      (item) =>
        item.content !== undefined && (
          <BaseTabs.Panel key={item.value} className={clsx(s.panel, panelClassName)} value={item.value}>
            {item.content}
          </BaseTabs.Panel>
        )
    )}
  </BaseTabs.Root>
);
