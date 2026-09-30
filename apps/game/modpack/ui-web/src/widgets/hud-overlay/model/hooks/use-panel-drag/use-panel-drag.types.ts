import type { Drag, Placement, Rect } from '../../../../../shared/lib/hud-geometry';
import type { HitTarget } from '../../../lib/hit-panel';

export type OverlayDrag = Drag & { moved: boolean; button: boolean };

export type PanelPress = Pick<MouseEvent, 'clientX' | 'clientY'>;

export type MovedPanel = { id: string; placement: Placement };

export type ScaledPanel = { id: string; scale: number };

export type DragTarget = HitTarget & { scale: number };

export type UsePanelDragInput = {
  edit: boolean;
  targets: () => DragTarget[];
  onMoved: (moved: MovedPanel) => void;
  onScaled: (scaled: ScaledPanel) => void;
};

export type StartDragInput = { id: string; press: PanelPress; rect: Rect; button: boolean };
