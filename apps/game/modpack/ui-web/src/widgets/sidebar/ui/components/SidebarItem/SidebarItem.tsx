import clsx from 'clsx';

import type { SidebarItemProps } from './SidebarItem.types';

import { Toggle } from '../../../../../shared/ui/toggle';

import s from './SidebarItem.module.scss';

export const SidebarItem = ({ item }: SidebarItemProps) => (
  <div className={clsx(s.item, item.active && s.itemOn)}>
    <button aria-current={item.active ? 'page' : undefined} className={s.itemTitle} type='button' onClick={item.open}>
      {item.component.title}
    </button>
    {item.component.switch && <Toggle label={item.component.title} on={item.component.switch.value} onToggle={item.toggle} />}
  </div>
);
