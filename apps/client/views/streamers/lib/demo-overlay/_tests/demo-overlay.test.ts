import { describe, expect, it } from 'vitest';

import { overlayDataSchema } from '@/shared/api/streamers';

import { DEMO_OVERLAY } from '../../../config';
import { demoOverlayData, demoRecordingSeconds, formatRecordingClock } from '../demo-overlay';

const TICKS = Array.from({ length: DEMO_OVERLAY.loop * 2 }, (_, index) => index);

describe('demoOverlayData', () => {
  it('always produces data the real overlay contract accepts', () => {
    TICKS.forEach((tick) => {
      expect(overlayDataSchema.safeParse(demoOverlayData({ tick, challengeTitle: 'Demo' })).success).toBe(true);
    });
  });

  it('changes the numbers from one tick to the next, so the preview feels live', () => {
    const first = demoOverlayData({ tick: 0, challengeTitle: 'Demo' });
    const second = demoOverlayData({ tick: 1, challengeTitle: 'Demo' });

    expect(second.session?.battles).not.toBe(first.session?.battles);
  });

  it('loops back to the same frame after a full cycle', () => {
    expect(demoOverlayData({ tick: DEMO_OVERLAY.loop, challengeTitle: 'Demo' })).toEqual(demoOverlayData({ tick: 0, challengeTitle: 'Demo' }));
  });

  it('never lets the challenge overshoot its target', () => {
    TICKS.forEach((tick) => {
      const { challenge } = demoOverlayData({ tick, challengeTitle: 'Demo' });

      expect(challenge?.value).toBeLessThanOrEqual(challenge?.target ?? 0);
    });
  });
});

describe('demoRecordingSeconds', () => {
  it('advances the recording clock by the tick length', () => {
    expect(demoRecordingSeconds(1) - demoRecordingSeconds(0)).toBe(Math.round(DEMO_OVERLAY.tickMs / 1_000));
  });
});

describe('formatRecordingClock', () => {
  it('pads hours, minutes and seconds to two digits', () => {
    expect(formatRecordingClock(3_600 + 2 * 60 + 5)).toBe('01:02:05');
  });

  it('starts at zero', () => {
    expect(formatRecordingClock(0)).toBe('00:00:00');
  });
});
