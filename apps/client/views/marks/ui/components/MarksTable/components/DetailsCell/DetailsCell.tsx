'use client';

import { ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { IconButton } from '@/ui-kit';

import type { DetailsCellProps } from './DetailsCell.types';

export const DetailsCell = ({ tank, onClick }: DetailsCellProps) => {
  const t = useTranslations('marks.table.columns');

  return (
    <IconButton aria-label={t('detailsLabel', { tank })} size='sm' onClick={onClick}>
      <ChevronRight size={14} />
    </IconButton>
  );
};
