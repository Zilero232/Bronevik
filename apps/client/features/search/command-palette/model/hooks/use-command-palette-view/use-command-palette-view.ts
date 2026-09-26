'use client';

import { useState } from 'react';

import { useRouter } from '@/shared/i18n/navigation';

import { useCommandPalette } from '../../context';
import { useSearchResults } from '../use-search-results';

export const useCommandPaletteView = () => {
  const router = useRouter();
  const { isOpen, setOpen } = useCommandPalette();
  const [query, setQuery] = useState('');
  const search = useSearchResults(query);

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

  return { ...search, isOpen, query, setQuery, onOpenChange, go, retry: () => void search.retry() };
};
