'use client';

import type { VehicleSummary } from '@otmetki/schemas';

import { Combobox } from '@base-ui/react/combobox';
import { clsx } from 'clsx';
import { ChevronsUpDown, RotateCcw, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useId } from 'react';

import { TankCell } from '@/entities/tank/tank';
import { useFormControl } from '@/shared/lib';
import { IconButton } from '@/ui-kit';

import type { TankPickerProps } from './TankPicker.types';

import { TANK_PICKER } from '../../config';
import { useTankPicker } from '../../model/hooks';

import s from './TankPicker.module.scss';

export const TankPicker = ({
  value,
  label,
  placeholder,
  excludeIds = [],
  className,
  onChange,
  id,
  'aria-describedby': describedBy,
  'aria-invalid': isInvalid
}: TankPickerProps) => {
  const t = useTranslations('tanks.picker');
  const tCommon = useTranslations('common');
  const { items, isLoading, isError, isFetching, retry } = useTankPicker(excludeIds);
  const ownId = useId();
  const control = useFormControl();

  const inputId = id ?? control.id ?? ownId;

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
          <label className={s.label} htmlFor={inputId}>
            {label}
          </label>
        )}
        <Combobox.InputGroup className={s.group} data-invalid={isError || undefined}>
          <Search aria-hidden className={s.icon} size={14} />
          <Combobox.Input
            aria-describedby={describedBy ?? control['aria-describedby']}
            aria-invalid={isInvalid ?? control['aria-invalid']}
            className={s.input}
            disabled={isLoading}
            id={inputId}
            placeholder={isError ? tCommon('loadErrorTitle') : (placeholder ?? t('placeholder'))}
          />
          {isError && (
            <span className={s.alert} role='alert'>
              {tCommon('loadErrorTitle')}
            </span>
          )}
          {isError ? (
            <IconButton aria-label={tCommon('retry')} disabled={isFetching} size='sm' title={tCommon('loadErrorTitle')} onClick={retry}>
              <RotateCcw size={14} />
            </IconButton>
          ) : (
            <Combobox.Trigger aria-label={t('open')} className={s.trigger}>
              <ChevronsUpDown size={14} />
            </Combobox.Trigger>
          )}
        </Combobox.InputGroup>
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
