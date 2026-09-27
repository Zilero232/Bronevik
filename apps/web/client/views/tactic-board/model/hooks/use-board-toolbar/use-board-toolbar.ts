'use client';

import { useWorkspace } from '../../context';

export const useBoardToolbar = () => {
  const workspace = useWorkspace();

  return {
    isEditable: workspace.isEditable,
    tool: workspace.tool,
    iconKind: workspace.iconKind,
    team: workspace.team,
    color: workspace.color,
    width: String(workspace.width),
    canUndo: workspace.canUndo,
    canRedo: workspace.canRedo,
    hasSelection: workspace.hasSelection,
    hasActiveLayer: workspace.activeLayer !== null,
    onToolChange: workspace.onToolChange,
    onIconKindChange: workspace.onIconKindChange,
    onTeamChange: workspace.onTeamChange,
    onColorChange: workspace.onColorChange,
    onWidthChange: (next: string) => workspace.onWidthChange(Number(next)),
    onUndo: workspace.onUndo,
    onRedo: workspace.onRedo,
    onDeleteSelected: workspace.onDeleteSelected,
    onClearLayer: workspace.onClearLayer
  };
};
