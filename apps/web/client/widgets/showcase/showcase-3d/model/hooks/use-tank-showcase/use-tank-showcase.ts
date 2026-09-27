'use client';

import { useDocumentVisibility } from '@siberiacancode/reactuse';
import { useInView } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import { vehicleIdentity } from '@/entities/tank/tank';

import type { UseTankShowcaseInput } from './use-tank-showcase.types';

import { SHOWCASE_ROTATION } from '../../../config';
import { rotationStep } from '../../../lib/rotation-cycle';
import { useShowcaseDrag } from '../use-showcase-drag';
import { useShowcaseMode } from '../use-showcase-mode';

export const useTankShowcase = ({ tank, tanks: list }: UseTankShowcaseInput) => {
  const mode = useShowcaseMode();
  const { drag, handlers } = useShowcaseDrag();
  const [picked, setPicked] = useState(0);
  const [readySlug, setReadySlug] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(rootRef, { margin: '80px' });
  const isPageVisible = useDocumentVisibility() !== 'hidden';

  const tanks = list ?? (tank ? [tank] : []);
  const index = picked < tanks.length ? picked : 0;
  const current = tanks.at(index);
  const isActive = isInView && isPageVisible;
  const isRotating = mode === 'live' && isActive && tanks.length > 1;
  const canvasMode = mode === 'live' || mode === 'still' ? mode : null;

  useEffect(() => {
    if (!isRotating) {
      return;
    }

    const timer = window.setTimeout(() => setPicked(rotationStep({ index, count: tanks.length })), SHOWCASE_ROTATION.intervalMs);

    return () => window.clearTimeout(timer);
  }, [isRotating, index, tanks.length]);

  return {
    rootRef,
    current,
    identity: current && vehicleIdentity(current),
    index,
    tanks,
    canvasMode,
    isActive,
    isFlatVisible: canvasMode === null || readySlug !== current?.slug,
    drag,
    dragHandlers: canvasMode === 'live' ? handlers : undefined,
    onSelect: setPicked,
    onReady: setReadySlug
  };
};
