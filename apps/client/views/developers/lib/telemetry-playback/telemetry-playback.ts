import { clamp } from 'remeda';

import type { TelemetryFrame, TelemetryFrameInput } from './telemetry-playback.types';

import { TELEMETRY_PLAYBACK } from './telemetry-playback.constants';

const { sendingTicks, ticksPerLine, holdTicks } = TELEMETRY_PLAYBACK;

export const telemetryCycle = ({ commandLength, lineCount }: Omit<TelemetryFrameInput, 'tick'>) =>
  commandLength + sendingTicks + lineCount * ticksPerLine + holdTicks;

export const finalTelemetryFrame = ({ commandLength, lineCount }: Omit<TelemetryFrameInput, 'tick'>): TelemetryFrame => ({
  phase: 'done',
  typed: commandLength,
  lines: lineCount
});

export const telemetryFrame = ({ tick, commandLength, lineCount }: TelemetryFrameInput): TelemetryFrame => {
  const at = Math.max(0, tick) % telemetryCycle({ commandLength, lineCount });
  const streamAt = at - commandLength - sendingTicks;

  if (at < commandLength) {
    return { phase: 'typing', typed: at, lines: 0 };
  }

  if (streamAt < 0) {
    return { phase: 'sending', typed: commandLength, lines: 0 };
  }

  if (streamAt < lineCount * ticksPerLine) {
    return { phase: 'streaming', typed: commandLength, lines: clamp(Math.floor(streamAt / ticksPerLine) + 1, { min: 1, max: lineCount }) };
  }

  return finalTelemetryFrame({ commandLength, lineCount });
};
