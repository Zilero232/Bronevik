import type { HudPanel } from '../../../../../shared/api/hud-protocol';
import type { Placement } from '../../../../../shared/lib/hud-geometry';
import type { RichLine } from '../../../../../shared/lib/rich-text';
import type { AnchorStyle } from '../../../lib/anchor';
import type { ResolvedWidget } from '../../../lib/widget-registry';
import type { MeasureRef } from '../use-panel-sizes';

export type Overrides = Partial<Record<string, Placement>>;

export type Scales = Partial<Record<string, number>>;

export type LabelStyle = AnchorStyle & { opacity: number; transform?: string; transformOrigin?: string };

export type HudLabelModel = {
  panel: HudPanel;
  lines: RichLine[];
  widget: ResolvedWidget | null;
  style: LabelStyle;
  button: boolean;
  interactive: boolean;
  framed: boolean;
  dragging: boolean;
  measureRef: MeasureRef;
  onClick: () => void;
};
