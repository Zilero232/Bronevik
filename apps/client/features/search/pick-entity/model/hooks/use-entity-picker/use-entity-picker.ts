'use client';

import { useBoolean } from '@siberiacancode/reactuse';
import { useState } from 'react';

import type { PickableKind, PickableResult } from '../use-entity-search';
import type { UseEntityPickerInput } from './use-entity-picker.types';

import { entityId } from '../../../lib/entity-id';
import { useEntitySearch } from '../use-entity-search';

export const useEntityPicker = <K extends PickableKind>({ kind, excludeIds, onPick }: UseEntityPickerInput<K>) => {
  const [query, setQuery] = useState('');
  const [isOpen, setOpen] = useBoolean(false);
  const { results, isEnabled, isFetching, isError, retry } = useEntitySearch({ kind, query });

  const visible = results.filter((result) => !excludeIds.includes(entityId(result)));

  const onQueryChange = (value: string) => {
    setQuery(value);
    setOpen(true);
  };

  const onSelect = (result: PickableResult<K>) => {
    onPick(result);
    setQuery('');
    setOpen(false);
  };

  return {
    query,
    visible,
    isOpen: isOpen && isEnabled,
    isFetching,
    isError,
    onQueryChange,
    onSelect,
    onOpen: () => setOpen(true),
    onClose: () => setOpen(false),
    retry: () => void retry()
  };
};
