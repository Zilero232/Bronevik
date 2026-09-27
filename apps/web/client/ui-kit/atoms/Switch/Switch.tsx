'use client';

import { Switch as BaseSwitch } from '@base-ui/react/switch';
import { clsx } from 'clsx';
import { useId } from 'react';

import type { SwitchProps } from './Switch.types';

import s from './Switch.module.scss';

export const Switch = ({ checked, label, description, className, onCheckedChange }: SwitchProps) => {
  const id = useId();

  return (
    <div className={clsx(s.root, className)}>
      <span className={s.text}>
        <label className={s.label} htmlFor={id}>
          {label}
        </label>
        {description && <span className={s.description}>{description}</span>}
      </span>
      <BaseSwitch.Root checked={checked} className={s.switch} id={id} onCheckedChange={onCheckedChange}>
        <BaseSwitch.Thumb className={s.thumb} />
      </BaseSwitch.Root>
    </div>
  );
};
