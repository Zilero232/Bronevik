'use client';

import { Crosshair, Flag, Redo2, Trash2, Undo2, XCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ClassIcon, IconButton, SegmentedControl } from '@/ui-kit';

import type { BoardTeam } from '../../../config';

import { BOARD_COLORS, BOARD_TANK_KINDS, BOARD_TEAMS, BOARD_TOOL_ICONS, BOARD_TOOLBAR_TOOLS, BOARD_WIDTHS } from '../../../config';
import { useBoardToolbar } from '../../../model/hooks';

import s from './BoardToolbar.module.scss';

export const BoardToolbar = () => {
  const t = useTranslations('tactics.toolbar');
  const {
    isEditable,
    tool,
    iconKind,
    team,
    color,
    width,
    canUndo,
    canRedo,
    hasSelection,
    hasActiveLayer,
    onToolChange,
    onIconKindChange,
    onTeamChange,
    onColorChange,
    onWidthChange,
    onUndo,
    onRedo,
    onDeleteSelected,
    onClearLayer
  } = useBoardToolbar();

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
        {BOARD_TANK_KINDS.map((kind) => (
          <IconButton
            key={kind}
            aria-label={t(`icons.${kind}`)}
            isActive={tool === 'icon' && iconKind === kind}
            size='sm'
            title={t(`icons.${kind}`)}
            onClick={() => onIconKindChange(kind)}
          >
            <ClassIcon size={16} tankClass={kind} />
          </IconButton>
        ))}
        <IconButton
          aria-label={t('icons.flag')}
          isActive={tool === 'icon' && iconKind === 'flag'}
          size='sm'
          title={t('icons.flag')}
          onClick={() => onIconKindChange('flag')}
        >
          <Flag size={16} />
        </IconButton>
        <IconButton
          aria-label={t('icons.marker')}
          isActive={tool === 'icon' && iconKind === 'marker'}
          size='sm'
          title={t('icons.marker')}
          onClick={() => onIconKindChange('marker')}
        >
          <Crosshair size={16} />
        </IconButton>
        <SegmentedControl<BoardTeam>
          aria-label={t('team')}
          options={BOARD_TEAMS.map((value) => ({ value, label: t(`teams.${value}`) }))}
          size='sm'
          value={team}
          onChange={onTeamChange}
        />
      </div>
      <div className={s.group}>
        <div aria-label={t('color')} className={s.swatches} role='radiogroup'>
          {BOARD_COLORS.map((value) => (
            <button
              key={value}
              aria-checked={color === value}
              aria-label={value}
              className={s.swatch}
              role='radio'
              style={{ backgroundColor: value }}
              type='button'
              onClick={() => onColorChange(value)}
            />
          ))}
        </div>
        <SegmentedControl
          options={BOARD_WIDTHS.map((value) => ({
            value: String(value),
            label: <span className={s.width} style={{ height: value }} />,
            'aria-label': String(value)
          }))}
          aria-label={t('width')}
          size='sm'
          value={width}
          onChange={onWidthChange}
        />
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
