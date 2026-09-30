import clsx from 'clsx';

import type { SidebarItemProps } from './SidebarItem.types';

import { useT } from '../../../../../entities/window-state';
import { useTooltip } from '../../../../../shared/lib/use-tooltip';
import { Icon } from '../../../../../shared/ui/icon';

import s from './SidebarItem.module.scss';

export const SidebarItem = ({ item, compact }: SidebarItemProps) => {
  const t = useT();
  const label = t(item.labelKey);
  const tip = useTooltip(compact ? label : undefined);

  return (
    <button
      aria-current={item.active ? 'page' : undefined}
      aria-label={label}
      className={clsx(s.item, item.active && s.itemOn, compact && s.compact)}
      type='button'
      onClick={item.open}
      {...tip}
    >
      <Icon name={item.icon} size={18} tone={item.active ? 'accent' : 'muted'} />
      {!compact && <span className={s.label}>{label}</span>}
      {!compact && item.count && <span className={s.count}>{item.count}</span>}
    </button>
  );
};
