import type { ClientSize } from '../../../../shared/gameface';
import type { UiPanel } from '../../protocol';

export type Size = ClientSize;

export type Rect = { left: number; top: number; width: number; height: number };

export type StageBox = Record<keyof Rect, string>;

type AlignX = UiPanel['align_x'];
type AlignY = UiPanel['align_y'];

export type Placement = { x: number; y: number; align_x: AlignX; align_y: AlignY };

export type PanelRectInput = { panel: Pick<UiPanel, 'align_x' | 'align_y' | 'height' | 'width' | 'x' | 'y'>; screen: Size };

export type RectOnScreen = { rect: Rect; screen: Size };

export type ScaleInput = { screen: Size; stage: Size };

export type DragInput = { rect: Rect; dx: number; dy: number; screen: Size; grid: number };

export type AnchorInput = { align: AlignX | AlignY; size: number; extent: number };

export type ThirdInput = { center: number; extent: number };

export type PercentInput = { value: number; extent: number };

export type NudgeSteps = Partial<Record<string, { dx: number; dy: number }>>;
