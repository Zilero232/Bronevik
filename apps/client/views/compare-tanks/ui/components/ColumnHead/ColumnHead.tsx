'use client';

import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { TankIdentity, TankImage, vehicleIdentity } from '@/entities/tank/tank';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { IconButton } from '@/ui-kit';

import type { ColumnHeadProps } from './ColumnHead.types';

import s from './ColumnHead.module.scss';

export const ColumnHead = ({ vehicle, onRemove }: ColumnHeadProps) => {
  const t = useTranslations('tanks.compare.board');

  return (
    <div className={s.root}>
      <IconButton aria-label={t('remove', { name: vehicle.name })} className={s.remove} size='sm' variant='ghost' onClick={onRemove}>
        <X size={14} />
      </IconButton>
      <TankImage isDecorative size='big' tank={vehicleIdentity(vehicle)} />
      <Link className={s.link} href={ROUTES.tank(vehicle.slug)}>
        <TankIdentity tank={vehicleIdentity(vehicle)} />
      </Link>
    </div>
  );
};
