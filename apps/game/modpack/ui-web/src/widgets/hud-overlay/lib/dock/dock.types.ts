import type { HudDock, HudPanel } from '../../../../shared/api/hud-protocol';
import type { Rect, Size } from '../../../../shared/lib/hud-geometry';

export type DockItem = { id: string; dock: HudDock | null; upward: boolean; align: HudPanel['align_x']; rect: Rect };

export type StackDocksInput = { items: DockItem[]; screen: Size; gap: number; reserve: number; ceiling: number };

export type LiftInput = { members: DockItem[]; free: Rect[]; screen: Size; gap: number; reserve: number; ceiling: number };

export type LimitInput = { item: DockItem; screen: Size; reserve: number };

export type SettledPanelsInput = { items: DockItem[]; measured: (id: string) => boolean };

export type RoofInput = { first: DockItem; free: Rect[]; gap: number; ceiling: number };
