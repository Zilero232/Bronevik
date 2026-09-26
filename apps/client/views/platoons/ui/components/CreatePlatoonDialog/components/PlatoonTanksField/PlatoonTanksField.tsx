'use client';

import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { TankPicker } from '@/features/tank/pick-tank';
import { IconButton, TankImage } from '@/ui-kit';

import { usePlatoonTanksField } from '../../../../../model/hooks';

import s from './PlatoonTanksField.module.scss';

export const PlatoonTanksField = () => {
  const t = useTranslations('platoons.create');
  const { tankIds, vehicles, isFull, onPick, onRemove } = usePlatoonTanksField();

  return (
    <div className={s.root}>
      {!isFull && <TankPicker excludeIds={tankIds} label={t('tanks')} placeholder={t('tanksPlaceholder')} value={null} onChange={onPick} />}
      {vehicles.length > 0 && (
        <ul className={s.list}>
          {vehicles.map((vehicle) => (
            <li key={vehicle.tankId} className={s.item}>
              <TankImage size='small' tank={vehicle} />
              <span className={s.name}>{vehicle.shortName}</span>
              <IconButton aria-label={t('removeTank', { name: vehicle.name })} size='sm' onClick={() => onRemove(vehicle.tankId)}>
                <X size={12} />
              </IconButton>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
