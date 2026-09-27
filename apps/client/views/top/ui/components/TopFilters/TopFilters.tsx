'use client';

import type { RatingKind, RatingPeriod, VehicleType } from '@otmetki/schemas';

import { TANK_CLASS_ICONS, TANK_CLASSES, TIERS, toRoman } from '@otmetki/icons';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { TankIdentity, vehicleIdentity } from '@/entities/tank/tank';
import { EntityPicker } from '@/features/search/pick-entity';
import { IconButton, Select } from '@/ui-kit';

import { TOP_METRICS, TOP_PERIODS } from '../../../config';
import { useTopFilters } from '../../../model/hooks';

import s from './TopFilters.module.scss';

export const TopFilters = () => {
  const t = useTranslations('top');
  const tPeriods = useTranslations('periods');
  const tGame = useTranslations('game.classes');
  const { scope, metric, period, tier, type, tank, hasTank, onMetricChange, onPeriodChange, onTierChange, onTypeChange, onTankChange } =
    useTopFilters();

  const metrics = TOP_METRICS[scope].map((value) => ({ value, label: t(`metrics.${value}`) }));
  const periods = TOP_PERIODS.map((value) => ({ value, label: value === 'overall' ? t('overall') : tPeriods(value) }));
  const tiers = [{ value: 'all' as const, label: t('allTiers') }, ...TIERS.map((value) => ({ value: `${value}` as const, label: toRoman(value) }))];
  const types = [
    { value: 'all' as const, label: t('allTypes') },
    ...TANK_CLASSES.map((value) => {
      const Icon = TANK_CLASS_ICONS[value];

      return { value, label: tGame(value), icon: <Icon size={16} /> };
    })
  ];

  return (
    <div className={s.root}>
      {metrics.length > 0 && (
        <div className={s.field}>
          <Select<RatingKind> items={metrics} label={t('metric')} value={metric} onValueChange={onMetricChange} />
        </div>
      )}
      <div className={s.field}>
        <Select<RatingPeriod> items={periods} label={t('period')} value={period} onValueChange={onPeriodChange} />
      </div>
      <div className={s.field}>
        <Select<string> items={tiers} label={t('tier')} value={tier} onValueChange={onTierChange} />
      </div>
      <div className={s.field}>
        <Select<'all' | VehicleType> items={types} label={t('type')} value={type} onValueChange={onTypeChange} />
      </div>
      {hasTank && (
        <div className={s.tank}>
          <span className={s.label}>{t('tank')}</span>
          {tank ? (
            <span className={s.picked}>
              <TankIdentity image='contour' tank={vehicleIdentity(tank)} withNation={false} />
              <IconButton aria-label={t('clearTank')} size='sm' onClick={() => onTankChange(null)}>
                <X size={14} />
              </IconButton>
            </span>
          ) : (
            <EntityPicker kind='tank' placeholder={t('tankPlaceholder')} onPick={({ vehicle }) => onTankChange(vehicle)} />
          )}
        </div>
      )}
    </div>
  );
};
