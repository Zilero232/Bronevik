'use client';

import type { VehicleSummary } from '@bronevik/schemas';

import { Combobox } from '@base-ui/react/combobox';
import { clsx } from 'clsx';
import { ChevronsUpDown, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useId } from 'react';

import { TankIdentity, vehicleIdentity } from '@/entities/tank/tank';

import type { TankPickerProps } from './TankPicker.types';

import { useVehicleCatalog } from '../model/hooks';

import s from './TankPicker.module.scss';

const PICKER_LIMIT = 60;

export const TankPicker = ({ value, label, placeholder, excludeIds = [], className, onChange }: TankPickerProps) => {
  const t = useTranslations('tanks.picker');
  const { data: vehicles = [], isLoading } = useVehicleCatalog();

  const id = useId();

  const items = vehicles.filter(({ tankId }) => !excludeIds.includes(tankId));

  return (
    <Combobox.Root<VehicleSummary>
      isItemEqualToValue={(item, selected) => item.tankId === selected.tankId}
      items={items}
      itemToStringLabel={(vehicle) => vehicle.name}
      limit={PICKER_LIMIT}
      value={value}
      onValueChange={onChange}
    >
      <div className={clsx(s.root, className)}>
        {label && (
          <label className={s.label} htmlFor={id}>
            {label}
          </label>
        )}
        <Combobox.InputGroup className={s.group}>
          <Search aria-hidden className={s.icon} size={16} />
          <Combobox.Input className={s.input} disabled={isLoading} id={id} placeholder={placeholder ?? t('placeholder')} />
          <Combobox.Trigger aria-label={t('open')} className={s.trigger}>
            <ChevronsUpDown size={15} />
          </Combobox.Trigger>
        </Combobox.InputGroup>
      </div>
      <Combobox.Portal>
        <Combobox.Positioner className={s.positioner} sideOffset={6}>
          <Combobox.Popup className={s.popup}>
            <Combobox.Empty className={s.empty}>{t('empty')}</Combobox.Empty>
            <Combobox.List className={s.list}>
              {(vehicle: VehicleSummary) => (
                <Combobox.Item key={vehicle.tankId} className={s.item} value={vehicle}>
                  <TankIdentity tank={vehicleIdentity(vehicle)} />
                </Combobox.Item>
              )}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  );
};
