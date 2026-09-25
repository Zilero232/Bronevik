'use client';

import { Command } from 'cmdk';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { useRouter } from '@/shared/i18n/navigation';

import { useCommandPalette } from '../model/context';
import { useSearchResults } from '../model/hooks';
import { PaletteFooter, PaletteInput, PaletteNavigation, PaletteResults, PaletteStatus } from './components';

import s from './CommandPalette.module.scss';

export const CommandPalette = () => {
  const t = useTranslations('search');
  const router = useRouter();
  const { isOpen, setOpen } = useCommandPalette();
  const [query, setQuery] = useState('');
  const { results, total, isEnabled, isFetching, isError } = useSearchResults(query);

  const onOpenChange = (next: boolean) => {
    setOpen(next);

    if (!next) {
      setQuery('');
    }
  };

  const go = (href: string) => {
    onOpenChange(false);
    router.push(href);
  };

  return (
    <Command.Dialog
      loop
      contentClassName={s.content}
      label={t('label')}
      open={isOpen}
      overlayClassName={s.overlay}
      shouldFilter={false}
      onOpenChange={onOpenChange}
    >
      <PaletteInput isFetching={isFetching} value={query} onValueChange={setQuery} />
      <Command.List className={s.list}>
        <PaletteStatus isEnabled={isEnabled} isError={isError} isFetching={isFetching} total={total} />
        {results && <PaletteResults results={results} onSelect={go} />}
        <PaletteNavigation query={query} onSelect={go} />
      </Command.List>
      <PaletteFooter />
    </Command.Dialog>
  );
};
