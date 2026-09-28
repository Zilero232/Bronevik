import type { HudPanel } from '../../../../shared/api/hud-protocol';
import type { Rect, Size } from '../../../../shared/lib/hud-geometry';

export type Anchor = Pick<HudPanel, 'align_x' | 'align_y' | 'x' | 'y'>;

export type AnchorStyle = Partial<Record<'bottom' | 'left' | 'marginLeft' | 'marginTop' | 'right' | 'top' | 'transform', string>>;

export type PageBoxInput = { box: Pick<DOMRect, 'height' | 'left' | 'top' | 'width'>; scale: number };

export type PageSizeInput = { width: number; height: number; scale: number };

export type RectStyleInput = { rect: Rect };

export type { Rect, Size };
