'use client';

import { Eye, EyeOff, Pencil, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { IconButton, Input } from '@/ui-kit';

import type { LayerRowProps } from './LayerRow.types';

import { BOARD_LIMITS } from '../../../../../config';
import { useLayerRow } from '../../../../../model/hooks';

import s from './LayerRow.module.scss';

export const LayerRow = ({ layer, isActive }: LayerRowProps) => {
  const t = useTranslations('tactics.layers');
  const {
    isEditable,
    inputRef,
    isRenaming,
    draftName,
    itemCount,
    onDraftChange,
    onStartRename,
    onCommitRename,
    onSubmitRename,
    onSelect,
    onToggle,
    onRemove
  } = useLayerRow(layer);

  return (
    <li className={s.root} data-active={isActive} data-hidden={!layer.visible}>
      <IconButton aria-label={layer.visible ? t('hide') : t('show')} disabled={!isEditable} size='sm' variant='ghost' onClick={onToggle}>
        {layer.visible ? <Eye size={14} /> : <EyeOff size={14} />}
      </IconButton>
      {isRenaming ? (
        <form className={s.rename} onSubmit={onSubmitRename}>
          <Input
            ref={inputRef}
            aria-label={t('rename')}
            maxLength={BOARD_LIMITS.layerName}
            value={draftName}
            onBlur={onCommitRename}
            onChange={(event) => onDraftChange(event.target.value)}
          />
        </form>
      ) : (
        <button className={s.name} type='button' onClick={onSelect} onDoubleClick={onStartRename}>
          <span className={s.label}>{layer.name || t('untitled')}</span>
          <span className={s.count}>{itemCount}</span>
        </button>
      )}
      {isEditable && !isRenaming && (
        <>
          <IconButton aria-label={t('rename')} size='sm' variant='ghost' onClick={onStartRename}>
            <Pencil size={14} />
          </IconButton>
          <IconButton aria-label={t('remove')} size='sm' variant='ghost' onClick={onRemove}>
            <Trash2 size={14} />
          </IconButton>
        </>
      )}
    </li>
  );
};
