import type { ClientSize } from '../../../../shared/api/gameface';
import type { Drag, Placement } from '../../../../shared/lib/hud-geometry';
import type { HitTarget } from '../hit-panel';

export type OverlayDrag = Drag & { moved: boolean; button: boolean };

export type PanelPress = Pick<MouseEvent, 'clientX' | 'clientY'>;

export type DragMotionInput = { drag: OverlayDrag; press: PanelPress; screen: ClientSize };

export type DragOutcome = { kind: 'moved'; placement: Placement } | { kind: 'pressed' } | { kind: 'still' };

export type PressDragInput = { target: HitTarget; press: PanelPress; scale: number };
