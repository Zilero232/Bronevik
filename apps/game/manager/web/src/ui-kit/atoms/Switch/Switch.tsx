import { Switch as BaseSwitch } from '@base-ui/react/switch';
import { clsx } from 'clsx';
import { useId } from 'react';

import type { SwitchProps } from './Switch.types';

import s from './Switch.module.scss';

export const Switch = ({ checked, label, description, disabled = false, isPending = false, hideLabel = false, onCheckedChange }: SwitchProps) => {
  const id = useId();
  const descriptionId = useId();

  return (
    <div className={s.root}>
      <span className={clsx(s.text, hideLabel && s.hidden)}>
        <label className={s.label} htmlFor={id}>
          {label}
        </label>
        {description && (
          <span className={s.description} id={descriptionId}>
            {description}
          </span>
        )}
      </span>
      <BaseSwitch.Root
        aria-busy={isPending || undefined}
        aria-describedby={description ? descriptionId : undefined}
        checked={checked}
        className={s.switch}
        disabled={disabled || isPending}
        id={id}
        onCheckedChange={onCheckedChange}
      >
        <BaseSwitch.Thumb className={s.thumb} />
      </BaseSwitch.Root>
    </div>
  );
};
