'use client';

import { useTranslations } from 'next-intl';

import { DateTimeField, FilterBar, FilterField, RangeField, SegmentedControl, Select, TierPicker } from '@/ui-kit';

import { PLATOON_VOICE } from '../../../config';
import { usePlatoonFilters } from '../../../model/hooks';

export const PlatoonFilters = () => {
  const t = useTranslations('platoons.filters');
  const {
    filters,
    active,
    wn8,
    tierValue,
    modeItems,
    modeValue,
    onTiersChange,
    onModeChange,
    onVoiceChange,
    onMinWn8Change,
    onMaxWn8Change,
    onAtChange,
    onReset
  } = usePlatoonFilters();

  return (
    <FilterBar active={active} label={t('title')} onReset={onReset}>
      <FilterField count={tierValue.length} label={t('tier')}>
        <TierPicker aria-label={t('tier')} mode='single' value={tierValue} onChange={onTiersChange} />
      </FilterField>
      <FilterField label={t('mode')} size='md'>
        <Select items={modeItems} value={modeValue} onValueChange={onModeChange} />
      </FilterField>
      <FilterField label={t('voice')}>
        <SegmentedControl
          aria-label={t('voice')}
          options={PLATOON_VOICE.map((value) => ({ value, label: t(`voiceOptions.${value}`) }))}
          value={filters.voice}
          onChange={onVoiceChange}
        />
      </FilterField>
      <FilterField label={wn8} size='md'>
        <RangeField
          aria-label={wn8}
          from={filters.minWn8}
          min={0}
          step={100}
          to={filters.maxWn8}
          onFromChange={onMinWn8Change}
          onToChange={onMaxWn8Change}
        />
      </FilterField>
      <FilterField label={t('at')} size='lg'>
        <DateTimeField value={filters.at ?? ''} onChange={onAtChange} />
      </FilterField>
    </FilterBar>
  );
};
