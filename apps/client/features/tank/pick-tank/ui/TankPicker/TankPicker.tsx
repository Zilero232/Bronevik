'use client';

import type { VehicleSummary } from '@bronevik/schemas';

import { Combobox } from '@base-ui/react/combobox';
import { clsx } from 'clsx';
import { ChevronsUpDown, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useId } from 'react';

import { TankCell } from '@/entities/tank/tank';
import { RetryButton } from '@/ui-kit';

import type { TankPickerProps } from './TankPicker.types';

import { TANK_PICKER } from '../../config';
import { useTankPicker } from '../../model/hooks';

import s from './TankPicker.module.scss';

export const TankPicker = ({ value, label, placeholder, excludeIds = [], className, onChange }: TankPickerProps) => {
  const t = useTranslations('tanks.picker');
  const tCommon = useTranslations('common');
  const { items, isLoading, isError, isFetching, retry } = useTankPicker(excludeIds);
  const id = useId();

  return (
    <Combobox.Root<VehicleSummary>
      isItemEqualToValue={(item, selected) => item.tankId === selected.tankId}
      items={items}
      itemToStringLabel={(vehicle) => vehicle.name}
      limit={TANK_PICKER.limit}
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
          <Search aria-hidden className={s.icon} size={14} />
          <Combobox.Input className={s.input} disabled={isLoading} id={id} placeholder={placeholder ?? t('placeholder')} />
          <Combobox.Trigger aria-label={t('open')} className={s.trigger}>
            <ChevronsUpDown size={14} />
          </Combobox.Trigger>
        </Combobox.InputGroup>
        {isError && (
          <div className={s.failure} role='alert'>
            <span>{tCommon('loadErrorTitle')}</span>
            <RetryButton disabled={isFetching} size='sm' variant='ghost' onClick={retry} />
          </div>
        )}
      </div>
      <Combobox.Portal>
        <Combobox.Positioner className={s.positioner} sideOffset={4}>
          <Combobox.Popup className={s.popup}>
            <Combobox.Empty className={s.empty}>{t('empty')}</Combobox.Empty>
            <Combobox.List className={s.list}>
              {(vehicle: VehicleSummary) => (
                <Combobox.Item key={vehicle.tankId} className={s.item} value={vehicle}>
                  <TankCell image='contour' vehicle={vehicle} />
                </Combobox.Item>
              )}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  );
};
