import type { LiveRect } from '../../../../shared/lib/hud-geometry';
import type { DragMotionInput, DragOutcome, OverlayDrag, PressDragInput } from './drag-motion.types';

import { dragTo, placementOf } from '../../../../shared/lib/hud-geometry';
import { HUD_OVERLAY } from '../../config';

export const pressDrag = ({ target, press, scale }: PressDragInput): OverlayDrag => ({
  id: target.id,
  mouseX: press.clientX,
  mouseY: press.clientY,
  scale,
  rect: target.rect,
  moved: false,
  button: target.button
});

export const liveAt = ({ drag, press, screen }: DragMotionInput): LiveRect =>
  dragTo({ drag, pointer: { x: press.clientX, y: press.clientY }, screen, grid: HUD_OVERLAY.grid }) ?? { id: drag.id, rect: drag.rect };

export const beyondSlop = ({ drag, press }: Omit<DragMotionInput, 'screen'>): boolean => {
  const dx = Math.abs(press.clientX - drag.mouseX);
  const dy = Math.abs(press.clientY - drag.mouseY);

  return dx > HUD_OVERLAY.clickSlop || dy > HUD_OVERLAY.clickSlop;
};

export const dragOutcome = ({ drag, press, screen }: DragMotionInput): DragOutcome => {
  const moved = drag.moved || beyondSlop({ drag, press });

  if (!moved) {
    return drag.button ? { kind: 'pressed' } : { kind: 'still' };
  }

  return { kind: 'moved', placement: placementOf({ rect: liveAt({ drag, press, screen }).rect, screen }) };
};
