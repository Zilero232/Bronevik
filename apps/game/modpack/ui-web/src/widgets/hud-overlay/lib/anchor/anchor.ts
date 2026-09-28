import type { Anchor, AnchorStyle, PageBoxInput, PageSizeInput, Rect, RectStyleInput, Size } from './anchor.types';

import { HUD_OVERLAY } from '../../config';

const length = (value: number): string => `${value}${HUD_OVERLAY.unit}`;

// The GUIFlash placement the panels store (core/hud): x/y are offsets from the anchor the panel is
// aligned to, positive to the right and down; a right-aligned panel's right edge sits -x from the
// screen's right edge (the HUD editor's geometry, shared/lib/hud-geometry).
export const anchorStyle = ({ x, y, align_x: alignX, align_y: alignY }: Anchor): AnchorStyle => {
  const style: AnchorStyle = {};

  if (alignX === 'left') {
    style.left = length(x);
  } else if (alignX === 'right') {
    style.right = length(-x);
  } else {
    style.left = HUD_OVERLAY.centered;
    style.marginLeft = length(x);
  }

  if (alignY === 'top') {
    style.top = length(y);
  } else if (alignY === 'bottom') {
    style.bottom = length(-y);
  } else {
    style.top = HUD_OVERLAY.centered;
    style.marginTop = length(y);
  }

  if (alignX === 'center' && alignY === 'center') {
    style.transform = HUD_OVERLAY.translate.both;
  } else if (alignX === 'center') {
    style.transform = HUD_OVERLAY.translate.x;
  } else if (alignY === 'center') {
    style.transform = HUD_OVERLAY.translate.y;
  }

  return style;
};

export const rectStyle = ({ rect }: RectStyleInput): AnchorStyle => ({ left: length(rect.left), top: length(rect.top) });

export const designRect = ({ box, scale }: PageBoxInput): Rect => ({
  left: box.left / scale,
  top: box.top / scale,
  width: box.width / scale,
  height: box.height / scale
});

export const designSize = ({ width, height, scale }: PageSizeInput): Size => ({ width: width / scale, height: height / scale });

export const rootScale = (fontSize: string): number => {
  const parsed = Number.parseFloat(fontSize);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : HUD_OVERLAY.fallbackScale;
};
