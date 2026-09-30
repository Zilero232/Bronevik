import type { ClientSize } from '../../../../../shared/api/gameface';
import type { Rect } from '../../../../../shared/lib/hud-geometry';
import type { DragTarget } from '../../../lib/hit-panel';
import type { MouseReport } from '../../../lib/mouse-report';

export type UseInputAreaInput = {
  edit: boolean;
  hover: boolean;
  dragging: boolean;
  screen: ClientSize;
  clickable: Rect[];
  targets: DragTarget[];
  report: MouseReport;
};
