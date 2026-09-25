'use client';

import { useInterval } from '@siberiacancode/reactuse';
import { useReducedMotion } from 'motion/react';
import { useState } from 'react';

import { useHydrated } from '@/shared/lib';

import type { TelemetryFrameInput } from '../../lib/telemetry-playback';

import { finalTelemetryFrame, TELEMETRY_PLAYBACK, telemetryFrame } from '../../lib/telemetry-playback';

export const useTelemetryPlayback = (script: Omit<TelemetryFrameInput, 'tick'>) => {
  const isHydrated = useHydrated();
  const isReduced = useReducedMotion();
  const [tick, setTick] = useState(0);

  useInterval(() => setTick((current) => current + 1), TELEMETRY_PLAYBACK.tickMs);

  return isHydrated && isReduced ? finalTelemetryFrame(script) : telemetryFrame({ tick, ...script });
};
