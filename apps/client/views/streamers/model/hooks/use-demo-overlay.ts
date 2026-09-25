'use client';

import { useInterval } from '@siberiacancode/reactuse';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { DEMO_OVERLAY } from '../../config';
import { demoOverlayData, demoRecordingSeconds } from '../../lib/demo-overlay';

export const useDemoOverlay = () => {
  const t = useTranslations('streamers.hero');
  const [tick, setTick] = useState(0);

  useInterval(() => setTick((value) => value + 1), DEMO_OVERLAY.tickMs);

  return { data: demoOverlayData({ tick, challengeTitle: t('challenge') }), seconds: demoRecordingSeconds(tick) };
};
