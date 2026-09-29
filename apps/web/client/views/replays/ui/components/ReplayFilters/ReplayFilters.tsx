'use client';

import type { ReplayTag } from '@otmetki/schemas';

import { NATIONS, TANK_CLASSES } from '@otmetki/icons';
import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { TankPicker } from '@/features/tank/pick-tank';
import { FilterBar, FilterField, IconFilter, Input, NumberField, Select, TierPicker, ToggleChips } from '@/ui-kit';

import type { ReplaySort } from '../../../lib/replay-query';

import { REPLAY_TIERS } from '../../../config';
import { useReplayFilterPanel } from '../../../model/hooks';

import s from './ReplayFilters.module.scss';

export const ReplayFilters = () => {
  const t = useTranslations('replays.filters');
  const {
    vehicle,
    playerDraft,
    clanDraft,
    mapValue,
    modeValue,
    resultValue,
    masteryValue,
    versionValue,
    sort,
    tiers,
    types,
    nations,
    tags,
    mapItems,
    modeItems,
    resultItems,
    sortItems,
    masteryItems,
    versionItems,
    tagOptions,
    minimums,
    active,
    advancedCount,
    onVehicleChange,
    onMapChange,
    onModeChange,
    onResultChange,
    onSortChange,
    onPlayerChange,
    onClanChange,
    onTiersChange,
    onTypesChange,
    onNationsChange,
    onMasteryChange,
    onVersionChange,
    onTagsChange,
    onMinimumChange,
    onReset
  } = useReplayFilterPanel();

  return (
    <FilterBar
      more={
        <>
          <FilterField count={tiers.length} label={t('tier')}>
            <TierPicker aria-label={t('tier')} options={REPLAY_TIERS} value={tiers} onChange={onTiersChange} />
          </FilterField>
          <FilterField count={types.length} label={t('type')}>
            <IconFilter aria-label={t('type')} kind='class' options={TANK_CLASSES} value={types} onChange={onTypesChange} />
          </FilterField>
          <FilterField count={nations.length} label={t('nation')}>
            <IconFilter aria-label={t('nation')} kind='nation' options={NATIONS} value={nations} onChange={onNationsChange} />
          </FilterField>
          <FilterField label={t('clan')} size='sm'>
            <Input placeholder={t('clanPlaceholder')} value={clanDraft} onChange={(event) => onClanChange(event.target.value)} />
          </FilterField>
          {minimums.map(({ key, value, step, label }) => (
            <FilterField key={key} label={label} size='sm'>
              <NumberField min={0} step={step} value={value} onValueChange={(next) => onMinimumChange({ key, value: next })} />
            </FilterField>
          ))}
          <FilterField label={t('masteryLabel')} size='md'>
            <Select items={masteryItems} value={masteryValue} onValueChange={onMasteryChange} />
          </FilterField>
          <FilterField label={t('version')} size='md'>
            <Select items={versionItems} value={versionValue} onValueChange={onVersionChange} />
          </FilterField>
          <FilterField className={s.tags} count={tags.length} label={t('tags')}>
            <ToggleChips<ReplayTag> aria-label={t('tags')} options={tagOptions} value={tags} onChange={onTagsChange} />
            <p className={s.hint}>{t('tagsHint')}</p>
          </FilterField>
        </>
      }
      active={active}
      moreCount={advancedCount}
      moreLabel={t('advanced')}
      variant='bare'
      onReset={onReset}
    >
      <FilterField label={t('tank')} size='lg'>
        <TankPicker placeholder={t('tankPlaceholder')} value={vehicle} onChange={onVehicleChange} />
      </FilterField>
      <FilterField label={t('map')} size='md'>
        <Select items={mapItems} value={mapValue} onValueChange={onMapChange} />
      </FilterField>
      <FilterField label={t('mode')} size='md'>
        <Select items={modeItems} value={modeValue} onValueChange={onModeChange} />
      </FilterField>
      <FilterField label={t('player')} size='md'>
        <Input
          icon={<Search size={14} />}
          placeholder={t('playerPlaceholder')}
          value={playerDraft}
          onChange={(event) => onPlayerChange(event.target.value)}
        />
      </FilterField>
      <FilterField label={t('result')} size='sm'>
        <Select items={resultItems} value={resultValue} onValueChange={onResultChange} />
      </FilterField>
      <FilterField label={t('sort')} size='md'>
        <Select<ReplaySort> items={sortItems} value={sort} onValueChange={onSortChange} />
      </FilterField>
    </FilterBar>
  );
};
