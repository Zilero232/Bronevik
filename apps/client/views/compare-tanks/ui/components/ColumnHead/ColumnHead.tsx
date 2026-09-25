'use client';

import { NATION_ICONS, TANK_CLASS_ICONS, toRoman } from '@bronevik/icons';
import { ArrowUpRight, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { TankIdentity, TankImage, vehicleIdentity } from '@/entities/tank/tank';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { IconButton } from '@/ui-kit';

import type { ColumnHeadProps } from './ColumnHead.types';

import { useCompareIds } from '../../../model/hooks';

import s from './ColumnHead.module.scss';

export const ColumnHead = ({ vehicle, index }: ColumnHeadProps) => {
  const t = useTranslations('tanks.compare.board');
  const tGame = useTranslations('game');
  const { remove } = useCompareIds();

  const identity = vehicleIdentity(vehicle);
  const ClassIcon = TANK_CLASS_ICONS[identity.type];
  const NationIcon = NATION_ICONS[identity.nation];

  return (
    <div className={s.root} data-premium={vehicle.isPremium}>
      <span aria-hidden className={s.watermark}>
        {toRoman(vehicle.tier)}
      </span>
      <TankImage isDecorative className={s.render} size='big' tank={identity} />
      <div className={s.top}>
        <span className={s.slot}>{t('slot', { index: index + 1 })}</span>
        <IconButton aria-label={t('remove', { name: vehicle.name })} size='sm' variant='ghost' onClick={() => remove(vehicle.tankId)}>
          <X size={14} />
        </IconButton>
      </div>
      <Link className={s.link} href={ROUTES.tank(vehicle.slug)}>
        <TankIdentity className={s.identity} size='lg' tank={identity} withNation={false} />
        <ArrowUpRight aria-hidden className={s.arrow} size={14} />
      </Link>
      <div className={s.meta}>
        <span className={s.tag}>
          <ClassIcon aria-hidden size={14} variant={identity.isPremium ? 'premium' : 'regular'} />
          {tGame(`classes.${identity.type}`)}
        </span>
        <span className={s.tag}>
          <NationIcon aria-hidden palette='color' size={16} />
          {tGame(`nations.${identity.nation}`)}
        </span>
      </div>
    </div>
  );
};
