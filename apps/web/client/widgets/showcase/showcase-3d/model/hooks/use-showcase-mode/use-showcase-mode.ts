'use client';

import { usePreferredReducedMotion } from '@siberiacancode/reactuse';

import { useHydrated } from '@/shared/lib';

import type { ShowcaseMode } from '../../../lib/showcase-mode';

import { readShowcaseEnvironment } from '../../../lib/showcase-environment';
import { resolveShowcaseMode } from '../../../lib/showcase-mode';

export const useShowcaseMode = (): ShowcaseMode | null => {
  const reducedMotion = usePreferredReducedMotion();
  const isHydrated = useHydrated();

  return isHydrated ? resolveShowcaseMode({ ...readShowcaseEnvironment(), prefersReducedMotion: reducedMotion === 'reduce' }) : null;
};
