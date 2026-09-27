'use client';

import { Crosshair, Flag } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ClassIcon, IconButton, SegmentedControl } from '@/ui-kit';

import type { BoardTeam } from '../../../../../model/board-tools.types';

import { BOARD_TANK_KINDS, BOARD_TEAMS } from '../../../../../config';
import { useBoardToolbar } from '../../../../../model/hooks';

export const ToolbarIcons = () => {
  const t = useTranslations('tactics.toolbar');
  const { tool, iconKind, team, onIconKindChange, onTeamChange } = useBoardToolbar();

  return (
    <>
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
    </>
  );
};
