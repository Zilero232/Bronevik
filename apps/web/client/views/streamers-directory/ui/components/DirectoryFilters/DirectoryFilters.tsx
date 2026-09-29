'use client';

import { useTranslations } from 'next-intl';

import { FilterBar, FilterField, Select, ToggleChips } from '@/ui-kit';

import type { DirectoryPlatformFilter, DirectoryToggle } from '../../../lib/directory-query';

import { DIRECTORY_PLATFORM_FILTERS, DIRECTORY_TOGGLES } from '../../../config';
import { useDirectoryFilters } from '../../../model/hooks';

export const DirectoryFilters = () => {
  const t = useTranslations('streamersDirectory.filters');
  const tPlatforms = useTranslations('streamersDirectory.channel.platforms');
  const { toggles, platform, activeCount, setToggles, setPlatform, reset } = useDirectoryFilters();

  return (
    <FilterBar activeCount={activeCount} label={t('label')} onReset={reset}>
      <FilterField count={toggles.length} label={t('status')}>
        <ToggleChips<DirectoryToggle>
          aria-label={t('status')}
          options={DIRECTORY_TOGGLES.map((value) => ({ value, label: t(value) }))}
          value={toggles}
          onChange={setToggles}
        />
      </FilterField>
      <FilterField label={t('platform')} size='lg'>
        <Select<DirectoryPlatformFilter>
          items={DIRECTORY_PLATFORM_FILTERS.map((value) => ({ value, label: value === 'all' ? t('anyPlatform') : tPlatforms(value) }))}
          value={platform}
          onValueChange={setPlatform}
        />
      </FilterField>
    </FilterBar>
  );
};
