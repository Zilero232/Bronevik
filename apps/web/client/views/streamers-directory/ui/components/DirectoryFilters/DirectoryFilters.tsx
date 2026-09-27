'use client';

import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button, Select, ToggleChips } from '@/ui-kit';

import type { DirectoryPlatformFilter, DirectoryToggle } from '../../../lib/directory-query';

import { DIRECTORY, DIRECTORY_PLATFORM_FILTERS, DIRECTORY_TOGGLES } from '../../../config';
import { useDirectoryFilters } from '../../../model/hooks';

import s from './DirectoryFilters.module.scss';

export const DirectoryFilters = () => {
  const t = useTranslations('streamersDirectory.filters');
  const tPlatforms = useTranslations('streamersDirectory.channel.platforms');
  const { toggles, platform, hasFilters, setToggles, setPlatform, reset } = useDirectoryFilters();

  return (
    <div className={s.root}>
      <ToggleChips<DirectoryToggle>
        aria-label={t('label')}
        options={DIRECTORY_TOGGLES.map((value) => ({ value, label: t(value) }))}
        size='sm'
        value={toggles}
        onChange={setToggles}
      />
      <Select<DirectoryPlatformFilter>
        aria-label={t('platform')}
        className={s.platform}
        items={DIRECTORY_PLATFORM_FILTERS.map((value) => ({ value, label: value === 'all' ? t('anyPlatform') : tPlatforms(value) }))}
        value={platform}
        onValueChange={setPlatform}
      />
      {hasFilters && (
        <Button size='sm' variant='ghost' onClick={reset}>
          <X size={DIRECTORY.iconSize} />
          {t('reset')}
        </Button>
      )}
    </div>
  );
};
