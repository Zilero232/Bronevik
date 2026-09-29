import type { Measured, StickyInput, WheelScaleInput } from './panel-size.types';

import { HUD_PROTOCOL } from '../../../../shared/api/hud-protocol';

// A label keeps the widest size its text took while the number of lines stays the same: a clock or a
// counter whose digits change width would otherwise move a right- or centre-anchored panel every tick.
export const stickySize = ({ previous, next }: StickyInput): Measured =>
  previous?.lines === next.lines
    ? { lines: next.lines, width: Math.max(previous.width, next.width), height: Math.max(previous.height, next.height) }
    : next;

export const sameSize = (a: Measured | undefined, b: Measured): boolean =>
  a !== undefined && a.lines === b.lines && a.width === b.width && a.height === b.height;

export const wheelScale = ({ current, deltaY }: WheelScaleInput): number => {
  const { min, max, step } = HUD_PROTOCOL.scale;
  const next = current + (deltaY < 0 ? step : -step);

  return Math.round(Math.min(max, Math.max(min, next)) * 100) / 100;
};
