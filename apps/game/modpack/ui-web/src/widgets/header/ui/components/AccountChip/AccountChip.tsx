import clsx from 'clsx';

import type { AccountChipProps } from './AccountChip.types';

import { useT } from '../../../../../entities/window-state';
import { useTooltip } from '../../../../../shared/lib/use-tooltip';
import { Icon } from '../../../../../shared/ui/icon';

import s from './AccountChip.module.scss';

export const AccountChip = ({ account, compact, onOpen }: AccountChipProps) => {
  const t = useT();
  const label = t(account.bound ? 'bound' : account.title);
  const tip = useTooltip(t(account.hint));

  return (
    <button aria-label={label} className={clsx(s.chip, s[account.tone])} type='button' onClick={onOpen} {...tip}>
      <Icon name={account.icon} size={14} tone={account.tone} />
      {!compact && <span className={s.label}>{label}</span>}
    </button>
  );
};
