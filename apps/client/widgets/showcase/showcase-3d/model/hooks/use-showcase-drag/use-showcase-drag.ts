'use client';

import type { PointerEvent } from 'react';

import { useRef } from 'react';

import type { ShowcaseDrag } from '../../showcase.types';

import { SHOWCASE_MOTION } from '../../../config';

export const useShowcaseDrag = () => {
  const dragRef = useRef<ShowcaseDrag>({ isActive: false, x: 0, impulse: 0 });

  const onPointerDown = (event: PointerEvent<HTMLElement>) => {
    if (event.target instanceof Element && event.target.closest(SHOWCASE_MOTION.dragIgnore)) {
      return;
    }

    dragRef.current = { ...dragRef.current, isActive: true, x: event.clientX };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (!dragRef.current.isActive) {
      return;
    }

    dragRef.current.impulse += (event.clientX - dragRef.current.x) * SHOWCASE_MOTION.dragFactor;
    dragRef.current.x = event.clientX;
  };

  const onPointerUp = () => {
    dragRef.current.isActive = false;
  };

  return { drag: dragRef, handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp } };
};
