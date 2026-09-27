'use client';

import { Search, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { TankPicker } from '@/features/tank/pick-tank';
import { Button, Input, Select } from '@/ui-kit';

import type { ReplaySort } from '../../../lib/replay-query';

import { useReplayFilterPanel } from '../../../model/hooks';

import s from './ReplayFilters.module.scss';

export const ReplayFilters = () => {
  const t = useTranslations('replays.filters');
  const {
    vehicle,
    playerDraft,
    mapValue,
    modeValue,
    resultValue,
    sort,
    mapItems,
    modeItems,
    resultItems,
    sortItems,
    isFiltered,
    onVehicleChange,
    onMapChange,
    onModeChange,
    onResultChange,
    onSortChange,
    onPlayerChange,
    onReset
  } = useReplayFilterPanel();

  return (
    <div className={s.root} role='search'>
      <TankPicker className={s.tank} label={t('tank')} placeholder={t('tankPlaceholder')} value={vehicle} onChange={onVehicleChange} />
      <Select className={s.select} items={mapItems} label={t('map')} value={mapValue} onValueChange={onMapChange} />
      <Select className={s.select} items={modeItems} label={t('mode')} value={modeValue} onValueChange={onModeChange} />
      <label className={s.player}>
        <span className={s.label}>{t('player')}</span>
        <Input
          aria-label={t('player')}
          icon={<Search size={14} />}
          placeholder={t('playerPlaceholder')}
          size='sm'
          value={playerDraft}
          onChange={(event) => onPlayerChange(event.target.value)}
        />
      </label>
      <Select className={s.select} items={resultItems} label={t('result')} value={resultValue} onValueChange={onResultChange} />
      <Select<ReplaySort> className={s.select} items={sortItems} label={t('sort')} value={sort} onValueChange={onSortChange} />
      {isFiltered && (
        <Button className={s.reset} size='sm' variant='ghost' onClick={onReset}>
          <X size={14} />
          {t('reset')}
        </Button>
      )}
    </div>
  );
};
