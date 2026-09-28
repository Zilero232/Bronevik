import type { HudPanel } from '../../../../../shared/api/hud-protocol';
import type { Placement, Rect } from '../../../../../shared/lib/hud-geometry';
import type { RichLine } from '../../../../../shared/lib/rich-text';
import type { AnchorStyle } from '../../../lib/anchor';

export type OverlayDrag = { id: string; mouseX: number; mouseY: number; scale: number; rect: Rect };

export type LivePanel = { id: string; rect: Rect };

export type Overrides = Partial<Record<string, Placement>>;

export type PanelPress = Pick<MouseEvent, 'clientX' | 'clientY'> & { currentTarget: EventTarget | null };

export type HudLabelModel = {
  panel: HudPanel;
  lines: RichLine[];
  style: AnchorStyle & { opacity: number };
  draggable: boolean;
  dragging: boolean;
  onMouseDown: (event: PanelPress) => void;
};
