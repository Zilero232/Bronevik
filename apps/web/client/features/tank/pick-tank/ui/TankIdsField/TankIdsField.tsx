'use client';

import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { IconButton, TankImage } from '@/ui-kit';

import type { TankIdsFieldProps } from './TankIdsField.types';

import { useTankIdsField } from '../../model/hooks';
import { TankPicker } from '../TankPicker';

import s from './TankIdsField.module.scss';

export const TankIdsField = ({ value, max, label, placeholder, onChange }: TankIdsFieldProps) => {
  const t = useTranslations('tanks.picker');
  const { vehicles, isFull, onPick, onRemove } = useTankIdsField({ value, max, onChange });

  return (
    <div className={s.root}>
      {!isFull && <TankPicker excludeIds={value} label={label} placeholder={placeholder} value={null} onChange={onPick} />}
      {vehicles.length > 0 && (
        <ul className={s.list}>
          {vehicles.map((vehicle) => (
            <li key={vehicle.tankId} className={s.item}>
              <TankImage isDecorative size='small' tank={vehicle} />
              <span className={s.name}>{vehicle.shortName}</span>
              <IconButton aria-label={t('remove', { name: vehicle.name })} size='sm' onClick={() => onRemove(vehicle.tankId)}>
                <X size={12} />
              </IconButton>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
