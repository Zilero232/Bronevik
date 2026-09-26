'use client';

import { Redo2, Trash2, Undo2, XCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { IconButton } from '@/ui-kit';

import { BOARD_TOOL_ICONS, BOARD_TOOLBAR_TOOLS } from '../../../config';
import { useBoardToolbar } from '../../../model/hooks';
import { ToolbarIcons, ToolbarStroke } from './components';

import s from './BoardToolbar.module.scss';

export const BoardToolbar = () => {
  const t = useTranslations('tactics.toolbar');
  const { isEditable, tool, canUndo, canRedo, hasSelection, hasActiveLayer, onToolChange, onUndo, onRedo, onDeleteSelected, onClearLayer } =
    useBoardToolbar();

  if (!isEditable) {
    return null;
  }

  return (
    <div aria-label={t('label')} className={s.root} role='toolbar'>
      <div className={s.group}>
        {BOARD_TOOLBAR_TOOLS.map((value) => {
          const Icon = BOARD_TOOL_ICONS[value];

          return (
            <IconButton
              key={value}
              aria-label={t(`tools.${value}`)}
              isActive={tool === value}
              size='sm'
              title={t(`tools.${value}`)}
              onClick={() => onToolChange(value)}
            >
              <Icon size={16} />
            </IconButton>
          );
        })}
      </div>
      <div className={s.group}>
        <ToolbarIcons />
      </div>
      <div className={s.group}>
        <ToolbarStroke />
      </div>
      <div className={s.group}>
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
      </div>
    </div>
  );
};
