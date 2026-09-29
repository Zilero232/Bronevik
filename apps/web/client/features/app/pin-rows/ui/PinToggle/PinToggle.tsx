'use client';

import { Pin, PinOff } from 'lucide-react';
import { memo } from 'react';

import { IconButton } from '@/ui-kit';

import type { PinToggleProps } from './PinToggle.types';

import { PIN_ROWS } from '../../config';
import { usePinToggle } from '../../model/hooks';

import s from './PinToggle.module.scss';

export const PinToggle = memo((props: PinToggleProps) => {
  const { label, onToggle } = usePinToggle(props);

  return (
    <IconButton
      aria-label={label}
      aria-pressed={props.isOn}
      className={s.root}
      data-on={props.isOn}
      isActive={props.isOn}
      size='sm'
      title={label}
      onClick={onToggle}
    >
      {props.isOn ? <PinOff aria-hidden size={PIN_ROWS.iconSize} /> : <Pin aria-hidden size={PIN_ROWS.iconSize} />}
    </IconButton>
  );
});
