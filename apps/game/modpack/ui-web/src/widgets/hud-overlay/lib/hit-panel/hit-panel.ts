import type { Point } from '../../../../shared/lib/hud-geometry';
import type { HitPanelInput, HitTarget, PointerPointInput } from './hit-panel.types';

const contains = ({ rect }: HitTarget, { x, y }: Point): boolean =>
  x >= rect.left && x <= rect.left + rect.width && y >= rect.top && y <= rect.top + rect.height;

// The page hit-tests panels itself in edit mode: an element under the pointer (an icon, a plate of a widget) must never
// decide whether a drag or a wheel resize starts. The last drawn panel is on top.
export const hitPanel = ({ targets, point }: HitPanelInput): HitTarget | null =>
  [...targets].reverse().find((target) => target.movable && contains(target, point)) ?? null;

export const pointerPoint = ({ clientX, clientY, scale }: PointerPointInput): Point => ({
  x: clientX / (scale > 0 ? scale : 1),
  y: clientY / (scale > 0 ? scale : 1)
});
