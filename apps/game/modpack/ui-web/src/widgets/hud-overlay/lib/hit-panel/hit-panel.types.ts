import type { Point, Rect } from '../../../../shared/lib/hud-geometry';

export type HitTarget = { id: string; rect: Rect; button: boolean; movable: boolean };

export type HitPanelInput = { targets: HitTarget[]; point: Point };

export type PointerPointInput = { clientX: number; clientY: number; scale: number };
