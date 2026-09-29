import type { Drag, Placement, Rect } from '../../../../../shared/lib/hud-geometry';

export type OverlayDrag = Drag & { moved: boolean; button: boolean };

export type PanelPress = Pick<MouseEvent, 'clientX' | 'clientY'>;

export type MovedPanel = { id: string; placement: Placement };

export type UsePanelDragInput = {
  edit: boolean;
  onMoved: (moved: MovedPanel) => void;
};

export type StartDragInput = { id: string; press: PanelPress; rect: Rect; button: boolean };
