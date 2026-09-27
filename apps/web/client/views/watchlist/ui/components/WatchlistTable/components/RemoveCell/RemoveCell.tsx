'use client';

import { Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { IconButton } from '@/ui-kit';

import type { RemoveCellProps } from './RemoveCell.types';

import { WATCHLIST_PAGE } from '../../../../../config';

export const RemoveCell = ({ player, isDisabled, onRemove }: RemoveCellProps) => {
  const t = useTranslations('watchlist.table');

  return (
    <IconButton
      aria-label={t('remove', { nickname: player.nickname ?? String(player.accountId) })}
      disabled={isDisabled}
      size='sm'
      onClick={() => onRemove(player)}
    >
      <Trash2 size={WATCHLIST_PAGE.iconSize} />
    </IconButton>
  );
};
