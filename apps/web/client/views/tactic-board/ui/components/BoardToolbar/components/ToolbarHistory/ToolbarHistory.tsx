'use client';

import { Redo2, Trash2, Undo2, XCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { IconButton } from '@/ui-kit';

import { useBoardToolbar } from '../../../../../model/hooks';

export const ToolbarHistory = () => {
  const t = useTranslations('tactics.toolbar');
  const { canUndo, canRedo, hasSelection, hasActiveLayer, onUndo, onRedo, onDeleteSelected, onClearLayer } = useBoardToolbar();

  return (
    <>
      <IconButton aria-label={t('undo')} disabled={!canUndo} size='sm' title={t('undo')} onClick={onUndo}>
        <Undo2 size={16} />
      </IconButton>
      <IconButton aria-label={t('redo')} disabled={!canRedo} size='sm' title={t('redo')} onClick={onRedo}>
        <Redo2 size={16} />
      </IconButton>
      <IconButton aria-label={t('deleteSelected')} disabled={!hasSelection} size='sm' title={t('deleteSelected')} onClick={onDeleteSelected}>
        <Trash2 size={16} />
      </IconButton>
      <IconButton aria-label={t('clearLayer')} disabled={!hasActiveLayer} size='sm' title={t('clearLayer')} onClick={onClearLayer}>
        <XCircle size={16} />
      </IconButton>
    </>
  );
};
