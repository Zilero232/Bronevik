'use client';

import type { RatingKind, RatingPeriod, VehicleType } from '@bronevik/schemas';

import { TANK_CLASS_ICONS, TANK_CLASSES, TIERS, toRoman } from '@bronevik/icons';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { TankIdentity, vehicleIdentity } from '@/entities/tank/tank';
import { EntityPicker } from '@/features/search/pick-entity';
import { Badge, IconButton, Select } from '@/ui-kit';

import type { TopFilterState } from '../../../lib/top-filter';
import type { TopFiltersProps } from './TopFilters.types';

import { TOP_METRICS, TOP_PERIODS, TOP_TANK_SCOPES } from '../../../config';
import { metricFor } from '../../../lib/top-filter';

import s from './TopFilters.module.scss';

export const TopFilters = ({ state, onChange }: TopFiltersProps) => {
  const t = useTranslations('top');
  const tPeriods = useTranslations('periods');
  const tGame = useTranslations('game.classes');

  const { scope, metric, period, tier, type, tank } = state;
  const metrics = TOP_METRICS[scope].map((value) => ({ value, label: t(`metrics.${value}`) }));
  const periods = TOP_PERIODS.map((value) => ({ value, label: value === 'overall' ? t('overall') : tPeriods(value) }));
  const tiers = [{ value: 'all' as const, label: t('allTiers') }, ...TIERS.map((value) => ({ value: `${value}` as const, label: toRoman(value) }))];
  const types = [
    { value: 'all' as const, label: t('allTypes') },
    ...TANK_CLASSES.map((value) => {
      const Icon = TANK_CLASS_ICONS[value];

      return { value, label: tGame(value), icon: <Icon size={14} /> };
    })
  ];

  return (
    <div className={s.root}>
      {metrics.length > 0 && (
        <div className={s.field}>
          <Select<RatingKind>
            items={metrics}
            label={t('metric')}
            value={metricFor({ scope, metric })}
            onValueChange={(next) => onChange({ metric: next })}
          />
        </div>
      )}
      <div className={s.field}>
        <Select<RatingPeriod> items={periods} label={t('period')} value={period} onValueChange={(next) => onChange({ period: next })} />
      </div>
      <div className={s.field}>
        <Select<TopFilterState['tier']> items={tiers} label={t('tier')} value={tier} onValueChange={(next) => onChange({ tier: next })} />
      </div>
      <div className={s.field}>
        <Select<'all' | VehicleType> items={types} label={t('type')} value={type} onValueChange={(next) => onChange({ type: next })} />
      </div>
      {TOP_TANK_SCOPES.includes(scope) && (
        <div className={s.tank}>
          <span className={s.label}>{t('tank')}</span>
          {tank ? (
            <Badge className={s.picked} tone='accent'>
              <TankIdentity image='contour' tank={tank} withNation={false} />
              <IconButton aria-label={t('clearTank')} size='sm' onClick={() => onChange({ tank: null })}>
                <X size={12} />
              </IconButton>
            </Badge>
          ) : (
            <EntityPicker
              kind='tank'
              placeholder={t('tankPlaceholder')}
              onPick={({ vehicle }) => onChange({ tank: { tankId: vehicle.tankId, ...vehicleIdentity(vehicle) } })}
            />
          )}
        </div>
      )}
    </div>
  );
};
