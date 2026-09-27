'use client';

import { useTranslations } from 'next-intl';

import type { FilteredEmptyStateProps } from './FilteredEmptyState.types';

import { Button } from '../../atoms';
import { EmptyState } from '../EmptyState';

export const FilteredEmptyState = ({ isFiltered, resetLabel, onReset, ...props }: FilteredEmptyStateProps) => {
  const t = useTranslations('common');

  return (
    <EmptyState
      {...props}
      action={
        isFiltered && (
          <Button size='sm' variant='secondary' onClick={onReset}>
            {resetLabel ?? t('resetFilters')}
          </Button>
        )
      }
    />
  );
};
