'use client';

import type { PointerEvent } from 'react';

import { useMotionValue, useSpring, useTransform } from 'motion/react';

import { MAPS_VIEW } from '../../../config';

const TILT_SPRING = { stiffness: 260, damping: 22, mass: 0.6 } as const;

export const useTilt = () => {
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const rotateY = useSpring(useTransform(x, [0, 1], [-MAPS_VIEW.tiltDeg, MAPS_VIEW.tiltDeg]), TILT_SPRING);
  const rotateX = useSpring(useTransform(y, [0, 1], [MAPS_VIEW.tiltDeg, -MAPS_VIEW.tiltDeg]), TILT_SPRING);

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse') {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();

    x.set((event.clientX - rect.left) / rect.width);
    y.set((event.clientY - rect.top) / rect.height);
  };

  const onPointerLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  return { rotateX, rotateY, onPointerMove, onPointerLeave };
};
