import type { Size } from '../../../../shared/lib/hud-geometry';

export type Measured = Size & { lines: number };

export type StickyInput = { previous: Measured | undefined; next: Measured };

export type WheelScaleInput = { current: number; deltaY: number };
