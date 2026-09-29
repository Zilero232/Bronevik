import type { RichLine } from '../../../../../shared/lib/rich-text';
import type { Measured } from '../../../lib/panel-size';
import type { ResolvedWidget } from '../../../lib/widget-registry';

export type Sizes = Partial<Record<string, Measured>>;

export type MeasureRef = (element: HTMLElement | null) => void;

export type UsePanelSizesInput = {
  lines: Map<string, RichLine[]>;
  widgets: Map<string, ResolvedWidget | null>;
};
