import type { AnchorStyle, PageBoxInput, PlaceInput, Rect, RectStyleInput } from './anchor.types';

import { clampRect, panelRect } from '../../../../shared/lib/hud-geometry';
import { HUD_OVERLAY } from '../../config';

const length = (value: number): string => `${Math.round(value)}${HUD_OVERLAY.unit}`;

// The GUIFlash placement the panels store (core/hud): x/y are offsets from the anchor the panel is aligned
// to, positive to the right and down. The page turns it into a left/top rect on the current screen (design
// pixels: the client size over the interface scale) and keeps the whole panel on screen, so a panel saved at
// another resolution or interface scale is never lost off the edge.
export const placeRect = ({ anchor, size, screen }: PlaceInput): Rect =>
  clampRect({ rect: panelRect({ panel: { ...anchor, width: size.width, height: size.height }, screen }), screen });

export const rectStyle = ({ rect }: RectStyleInput): AnchorStyle => ({ left: length(rect.left), top: length(rect.top) });

export const designRect = ({ box, scale }: PageBoxInput): Rect => ({
  left: box.left / scale,
  top: box.top / scale,
  width: box.width / scale,
  height: box.height / scale
});
