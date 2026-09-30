import clsx from 'clsx';

import type { SidebarItemProps } from './SidebarItem.types';

import { useT } from '../../../../../entities/window-state';
import { Icon } from '../../../../../shared/ui/icon';

import s from './SidebarItem.module.scss';

export const SidebarItem = ({ item, compact }: SidebarItemProps) => {
  const t = useT();
  const label = t(item.labelKey);

  return (
    <button
      aria-current={item.active ? 'page' : undefined}
      aria-label={label}
      className={clsx(s.item, item.active && s.itemOn, compact && s.compact)}
      title={compact ? label : undefined}
      type='button'
      onClick={item.open}
    >
      <Icon name={item.icon} size={18} tone={item.active ? 'accent' : 'muted'} />
      {!compact && <span className={s.label}>{label}</span>}
      {!compact && item.count && <span className={s.count}>{item.count}</span>}
    </button>
  );
};
