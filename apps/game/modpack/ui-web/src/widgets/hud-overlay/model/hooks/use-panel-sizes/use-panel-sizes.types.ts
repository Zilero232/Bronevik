import type { ResolvedWidget } from '../../../../../entities/hud-widgets/registry';
import type { RichLine } from '../../../../../shared/lib/rich-text';
import type { Measured } from '../../../lib/panel-size';

export type Sizes = Partial<Record<string, Measured>>;

export type MeasureRef = (element: HTMLElement | null) => void;

export type UsePanelSizesInput = {
  lines: Map<string, RichLine[]>;
  widgets: Map<string, ResolvedWidget | null>;
};
