'use client';

import { X } from 'lucide-react';

import { Link } from '@/shared/i18n/navigation';
import { Avatar, TankImage } from '@/ui-kit';

import type { TrayChipProps } from './TrayChip.types';

import { COMPARE_TRAY } from '../../../config';

import s from './TrayChip.module.scss';

export const TrayChip = ({ chip, isOver, removeLabel, onRemove, onNavigate }: TrayChipProps) => (
  <span className={s.root} data-over={isOver}>
    <Link className={s.link} href={chip.href} onClick={onNavigate}>
      {chip.tank ? <TankImage isDecorative size='contour' tank={chip.tank} /> : <Avatar name={chip.name} size='sm' />}
      <span className={s.name}>{chip.name}</span>
    </Link>
    <button aria-label={removeLabel} className={s.remove} title={removeLabel} type='button' onClick={() => onRemove(chip.id)}>
      <X aria-hidden size={COMPARE_TRAY.chipIconSize} />
    </button>
  </span>
);
