import { range } from 'remeda';
import { describe, expect, it } from 'vitest';

import { finalTelemetryFrame, telemetryCycle, telemetryFrame } from '../telemetry-playback';

const SCRIPT = { commandLength: 40, lineCount: 9 };
const cycle = telemetryCycle(SCRIPT);
const frames = range(0, cycle).map((tick) => telemetryFrame({ tick, ...SCRIPT }));

describe('telemetryFrame', () => {
  it('starts from an empty prompt', () => {
    expect(frames[0]).toEqual({ phase: 'typing', typed: 0, lines: 0 });
  });

  it('never un-types a character or hides a revealed line within one cycle', () => {
    frames.slice(1).forEach((frame, index) => {
      const previous = frames[index];

      expect(frame.typed).toBeGreaterThanOrEqual(previous?.typed ?? 0);
      expect(frame.lines).toBeGreaterThanOrEqual(previous?.lines ?? 0);
    });
  });

  it('streams no response before the command is fully typed', () => {
    frames.filter(({ lines }) => lines > 0).forEach(({ typed }) => expect(typed).toBe(SCRIPT.commandLength));
  });

  it('walks through every phase in order', () => {
    const phases = frames.map(({ phase }) => phase).filter((phase, index, all) => phase !== all[index - 1]);

    expect(phases).toEqual(['typing', 'sending', 'streaming', 'done']);
  });

  it('holds the finished frame and then loops back to the start', () => {
    expect(frames.at(-1)).toEqual(finalTelemetryFrame(SCRIPT));
    expect(telemetryFrame({ tick: cycle, ...SCRIPT })).toEqual(frames[0]);
  });

  it('treats a negative tick as the start', () => {
    expect(telemetryFrame({ tick: -5, ...SCRIPT })).toEqual(frames[0]);
  });
});
