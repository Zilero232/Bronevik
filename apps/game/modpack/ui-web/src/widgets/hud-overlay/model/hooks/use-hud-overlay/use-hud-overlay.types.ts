import type { HudPanel } from '../../../../../shared/api/hud-protocol';
import type { Placement, Rect } from '../../../../../shared/lib/hud-geometry';
import type { RichLine } from '../../../../../shared/lib/rich-text';
import type { AnchorStyle } from '../../../lib/anchor';
import type { Measured } from '../../../lib/panel-size';

export type OverlayDrag = { id: string; mouseX: number; mouseY: number; scale: number; rect: Rect; moved: boolean; button: boolean };

export type LivePanel = { id: string; rect: Rect };

export type Overrides = Partial<Record<string, Placement>>;

export type Scales = Partial<Record<string, number>>;

export type Sizes = Partial<Record<string, Measured>>;

export type PanelPress = Pick<MouseEvent, 'clientX' | 'clientY'>;

export type PanelWheel = Pick<WheelEvent, 'deltaY' | 'preventDefault'>;

export type LabelStyle = AnchorStyle & { opacity: number; transform?: string; transformOrigin?: string };

export type HudLabelModel = {
  panel: HudPanel;
  lines: RichLine[];
  style: LabelStyle;
  button: boolean;
  interactive: boolean;
  framed: boolean;
  dragging: boolean;
  measureRef: (element: HTMLElement | null) => void;
  onMouseDown: (event: PanelPress) => void;
  onWheel: (event: PanelWheel) => void;
  onClick: () => void;
};
