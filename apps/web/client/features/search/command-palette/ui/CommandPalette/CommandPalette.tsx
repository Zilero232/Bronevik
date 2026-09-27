'use client';

import { Command } from 'cmdk';
import { useTranslations } from 'next-intl';

import { useCommandPaletteView } from '../../model/hooks';
import { PaletteFooter, PaletteInput, PaletteNavigation, PaletteResults, PaletteStatus } from '../components';

import s from './CommandPalette.module.scss';

export const CommandPalette = () => {
  const t = useTranslations('search');
  const { isOpen, query, setQuery, onOpenChange, go, results, total, isEnabled, isFetching, isError, retry } = useCommandPaletteView();

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
      <PaletteInput isFetching={isFetching} value={query} onClose={() => onOpenChange(false)} onValueChange={setQuery} />
      <Command.List className={s.list}>
        <PaletteStatus isEnabled={isEnabled} isError={isError} isFetching={isFetching} total={total} onRetry={retry} />
        {results && <PaletteResults results={results} onSelect={go} />}
        <PaletteNavigation query={query} onSelect={go} />
      </Command.List>
      <PaletteFooter />
    </Command.Dialog>
  );
};
