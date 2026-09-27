import type { Mote, Tracer } from '../battle-backdrop';

export type BackdropSurface = {
  context: CanvasRenderingContext2D;
  width: number;
  height: number;
};

export type PaintContoursInput = BackdropSurface & {
  segments: readonly number[];
  color: string;
};

export type PaintMotionInput = BackdropSurface & {
  motes: readonly Mote[];
  tracers: readonly Tracer[];
  now: number;
  color: string;
  tracerColor: string;
};
