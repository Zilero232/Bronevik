export type ContourInput = {
  seed: number;
  cols: number;
  rows: number;
  levels: readonly number[];
};

export type Mote = {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  alpha: number;
  isSmoke: boolean;
};

export type CreateMotesInput = {
  seed: number;
  dust: number;
  smoke: number;
};

export type StepMotesInput = {
  motes: Mote[];
  seconds: number;
};

export type Tracer = {
  from: readonly [number, number];
  to: readonly [number, number];
  born: number;
  life: number;
  tail: number;
};

export type CreateTracerInput = {
  random: () => number;
  now: number;
  life: number;
};

export type TracerSegmentInput = {
  tracer: Tracer;
  now: number;
};

export type TracerSegment = {
  head: readonly [number, number];
  tail: readonly [number, number];
  fade: number;
};

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
