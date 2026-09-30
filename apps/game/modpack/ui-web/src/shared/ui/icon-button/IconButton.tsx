import clsx from 'clsx';

import type { IconButtonProps } from './IconButton.types';

import { useTooltip } from '../../lib/use-tooltip';
import { Icon } from '../icon';

import s from './IconButton.module.scss';

export const IconButton = ({ icon, label, variant = 'default', size = 'default', tone, disabled, className, onClick }: IconButtonProps) => {
  const tip = useTooltip(label);

  return (
    <button
      aria-label={label}
      className={clsx(s.button, s[variant], s[size], className)}
      disabled={disabled}
      type='button'
      onClick={onClick}
      {...tip}
    >
      <Icon name={icon} size={size === 'small' ? 14 : 16} tone={tone ?? (variant === 'accent' ? 'contrast' : 'text')} />
    </button>
  );
};
