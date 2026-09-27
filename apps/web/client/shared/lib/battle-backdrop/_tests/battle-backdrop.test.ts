import { describe, expect, it } from 'vitest';

import { contourSegments, createMotes, createTracer, stepMotes, tracerSegment } from '../battle-backdrop';

describe('contourSegments', () => {
  const input = { seed: 7, cols: 32, rows: 16, levels: [0.35, 0.45, 0.55] };

  it('is deterministic for a seed', () => {
    expect(contourSegments(input)).toEqual(contourSegments(input));
    expect(contourSegments(input)).not.toEqual(contourSegments({ ...input, seed: 8 }));
  });

  it('emits whole segments inside the unit square', () => {
    const segments = contourSegments(input);

    expect(segments.length).toBeGreaterThan(0);
    expect(segments.length % 4).toBe(0);
    expect(segments.every((value) => value >= 0 && value <= 1)).toBe(true);
  });
});

describe('motes', () => {
  it('creates dust then smoke', () => {
    const motes = createMotes({ seed: 1, dust: 3, smoke: 2 });

    expect(motes.map((mote) => mote.isSmoke)).toEqual([false, false, false, true, true]);
  });

  it('drifts and wraps around the edges', () => {
    const [mote] = createMotes({ seed: 1, dust: 1, smoke: 0 });

    mote.x = 1;
    mote.vx = 1;
    stepMotes({ motes: [mote], seconds: 0.5 });

    expect(mote.x).toBeLessThan(0);
  });
});

describe('tracers', () => {
  const tracer = createTracer({ random: () => 0.25, now: 10, life: 1 });

  it('crosses the whole width', () => {
    expect(tracer.from[0]).toBeLessThan(0);
    expect(tracer.to[0]).toBeGreaterThan(1);
  });

  it('has a tail behind the head and fades out', () => {
    const segment = tracerSegment({ tracer, now: 10.5 });

    expect(segment?.tail[0]).toBeLessThan(segment?.head[0] ?? 0);
    expect(tracerSegment({ tracer, now: 10.9 })?.fade).toBeLessThan(segment?.fade ?? 0);
  });

  it('is gone outside its life', () => {
    expect(tracerSegment({ tracer, now: 9 })).toBeNull();
    expect(tracerSegment({ tracer, now: 11.1 })).toBeNull();
  });
});
