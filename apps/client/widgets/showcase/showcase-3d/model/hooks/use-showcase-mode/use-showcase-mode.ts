'use client';

import { useSyncExternalStore } from 'react';

import type { ShowcaseMode } from '../../../lib/showcase-mode';

import { readShowcaseEnvironment, REDUCED_MOTION_QUERY } from '../../../lib/showcase-environment';
import { resolveShowcaseMode } from '../../../lib/showcase-mode';

const subscribe = (onChange: () => void) => {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);

  query.addEventListener('change', onChange);

  return () => query.removeEventListener('change', onChange);
};

const snapshot = (): ShowcaseMode => resolveShowcaseMode(readShowcaseEnvironment());

const serverSnapshot = (): ShowcaseMode | null => null;

export const useShowcaseMode = (): ShowcaseMode | null => useSyncExternalStore(subscribe, snapshot, serverSnapshot);
