import type { Placement } from '../../../../../shared/lib/hud-geometry';
import type { OverlayDrag, PanelPress } from '../../../lib/drag-motion';
import type { DragTarget } from '../../../lib/hit-panel';
import type { MouseReport } from '../../../lib/mouse-report';

export type MovedPanel = { id: string; placement: Placement };

export type SettleDragInput = { drag: OverlayDrag; press: PanelPress; onMoved: (moved: MovedPanel) => void };

export type ScaledPanel = { id: string; scale: number };

export type UsePanelDragInput = {
  edit: boolean;
  targets: () => DragTarget[];
  onMoved: (moved: MovedPanel) => void;
  onScaled: (scaled: ScaledPanel) => void;
  report: MouseReport;
};
