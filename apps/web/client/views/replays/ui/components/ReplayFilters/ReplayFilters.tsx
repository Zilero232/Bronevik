'use client';

import type { ReplayTag } from '@otmetki/schemas';

import { NATIONS, TANK_CLASSES } from '@otmetki/icons';
import { useBoolean } from '@siberiacancode/reactuse';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { TankPicker } from '@/features/tank/pick-tank';
import { Button, IconFilter, Input, NumberField, Select, ToggleChips } from '@/ui-kit';

import type { ReplaySort } from '../../../lib/replay-query';

import { REPLAY_TIERS } from '../../../config';
import { useReplayFilterPanel } from '../../../model/hooks';

import s from './ReplayFilters.module.scss';

export const ReplayFilters = () => {
  const t = useTranslations('replays.filters');
  const [isAdvanced, toggleAdvanced] = useBoolean();
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
    isFiltered,
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
    <div className={s.root} role='search'>
      <div className={s.row}>
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
        <div className={s.actions}>
          <Button aria-expanded={isAdvanced} size='sm' variant='ghost' onClick={() => toggleAdvanced()}>
            <SlidersHorizontal size={14} />
            {t('advanced')}
          </Button>
          {isFiltered && (
            <Button size='sm' variant='ghost' onClick={onReset}>
              <X size={14} />
              {t('reset')}
            </Button>
          )}
        </div>
      </div>
      {isAdvanced && (
        <div className={s.advanced}>
          <div className={s.row}>
            <IconFilter aria-label={t('tier')} kind='tier' options={REPLAY_TIERS} size='sm' value={tiers} onChange={onTiersChange} />
            <IconFilter aria-label={t('type')} kind='class' options={TANK_CLASSES} size='sm' value={types} onChange={onTypesChange} />
            <IconFilter aria-label={t('nation')} kind='nation' options={NATIONS} size='sm' value={nations} onChange={onNationsChange} />
          </div>
          <div className={s.row}>
            <label className={s.player}>
              <span className={s.label}>{t('clan')}</span>
              <Input
                aria-label={t('clan')}
                placeholder={t('clanPlaceholder')}
                size='sm'
                value={clanDraft}
                onChange={(event) => onClanChange(event.target.value)}
              />
            </label>
            {minimums.map(({ key, value, step, label }) => (
              <NumberField
                key={key}
                className={s.minimum}
                label={label}
                min={0}
                step={step}
                value={value}
                onValueChange={(next) => onMinimumChange({ key, value: next })}
              />
            ))}
            <Select className={s.select} items={masteryItems} label={t('masteryLabel')} value={masteryValue} onValueChange={onMasteryChange} />
            <Select className={s.select} items={versionItems} label={t('version')} value={versionValue} onValueChange={onVersionChange} />
          </div>
          <ToggleChips<ReplayTag> aria-label={t('tags')} options={tagOptions} size='sm' value={tags} onChange={onTagsChange} />
          <p className={s.hint}>{t('tagsHint')}</p>
        </div>
      )}
    </div>
  );
};
