export type TelemetryPhase = 'done' | 'sending' | 'streaming' | 'typing';

export type TelemetryFrameInput = {
  tick: number;
  commandLength: number;
  lineCount: number;
};

export type TelemetryFrame = {
  phase: TelemetryPhase;
  typed: number;
  lines: number;
};
