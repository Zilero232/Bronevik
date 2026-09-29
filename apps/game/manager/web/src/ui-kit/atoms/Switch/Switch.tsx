import { Switch as BaseSwitch } from '@base-ui/react/switch';
import { clsx } from 'clsx';
import { Lock } from 'lucide-react';
import { useId } from 'react';

import type { SwitchProps } from './Switch.types';

import s from './Switch.module.scss';

export const Switch = ({
  checked,
  label,
  description,
  disabled = false,
  isLocked = false,
  isPending = false,
  hideLabel = false,
  onCheckedChange
}: SwitchProps) => {
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
        data-locked={isLocked || undefined}
        disabled={disabled || isLocked || isPending}
        id={id}
        onCheckedChange={onCheckedChange}
      >
        <BaseSwitch.Thumb className={s.thumb}>{isLocked && <Lock aria-hidden className={s.lock} />}</BaseSwitch.Thumb>
      </BaseSwitch.Root>
    </div>
  );
};
