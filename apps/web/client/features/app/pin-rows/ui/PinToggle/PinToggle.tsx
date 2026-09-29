'use client';

import { Pin, PinOff } from 'lucide-react';

import { IconButton } from '@/ui-kit';

import type { PinToggleProps } from './PinToggle.types';

import { PIN_ROWS } from '../../config';
import { usePinToggle } from '../../model/hooks';

import s from './PinToggle.module.scss';

export const PinToggle = (props: PinToggleProps) => {
  const { isOn, label, onToggle } = usePinToggle(props);

  return (
    <IconButton aria-label={label} aria-pressed={isOn} className={s.root} data-on={isOn} isActive={isOn} size='sm' title={label} onClick={onToggle}>
      {isOn ? <PinOff aria-hidden size={PIN_ROWS.iconSize} /> : <Pin aria-hidden size={PIN_ROWS.iconSize} />}
    </IconButton>
  );
};
