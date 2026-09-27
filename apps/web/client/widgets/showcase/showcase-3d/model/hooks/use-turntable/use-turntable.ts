'use client';

import type { Group } from 'three';

import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';

import type { UseTurntableInput } from './use-turntable.types';

import { SHOWCASE_CANVAS, SHOWCASE_MOTION } from '../../../config';
import { applyHologramFrame } from '../../../lib/hologram-material';
import { turretYaw } from '../../../lib/turret-yaw';

export const useTurntable = ({ rig, materials, sweep, isLive, drag }: UseTurntableInput) => {
  'use no memo';

  const rootRef = useRef<Group>(null);
  const turretRef = useRef<Group>(null);
  const motionRef = useRef({ yaw: SHOWCASE_MOTION.initialYaw, parallaxYaw: 0, parallaxPitch: 0, revealFrom: -1 });
  const camera = useThree((state) => state.camera);
  const aspect = useThree((state) => state.size.width / Math.max(state.size.height, 1));
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    const distance = rig.radius * SHOWCASE_CANVAS.distanceFactor * Math.max(1, SHOWCASE_CANVAS.narrowAspect / aspect);

    camera.position.set(0, distance * SHOWCASE_CANVAS.elevation + rig.height * 0.5, distance);
    camera.lookAt(0, rig.height * (0.5 - SHOWCASE_CANVAS.targetLift), 0);
    motionRef.current.revealFrom = -1;
    invalidate();
  }, [rig, aspect, camera, invalidate]);

  useFrame(({ clock, pointer }, delta) => {
    const state = motionRef.current;
    const seconds = clock.getElapsedTime();
    const step = Math.min(delta, 0.1);

    if (state.revealFrom < 0) {
      state.revealFrom = seconds;
    }

    if (isLive) {
      const damping = 1 - Math.exp(-SHOWCASE_MOTION.parallaxDamping * step);

      const dragged = drag.current.impulse * (1 - Math.exp(-SHOWCASE_MOTION.dragFollow * step));

      state.yaw += SHOWCASE_MOTION.spinPerSecond * step + dragged;
      drag.current.impulse -= dragged;
      state.parallaxYaw += (pointer.x * SHOWCASE_MOTION.parallaxYaw - state.parallaxYaw) * damping;
      state.parallaxPitch += (-pointer.y * SHOWCASE_MOTION.parallaxPitch - state.parallaxPitch) * damping;
    }

    rootRef.current?.rotation.set(state.parallaxPitch, state.yaw + state.parallaxYaw, 0);
    turretRef.current?.rotation.set(0, isLive ? turretYaw({ seconds, amplitude: sweep, period: SHOWCASE_MOTION.turretPeriodSeconds }) : 0, 0);

    const reveal = isLive ? ((seconds - state.revealFrom) / SHOWCASE_MOTION.revealSeconds) * 1.05 : 1;
    const scan = isLive ? ((seconds / SHOWCASE_MOTION.scanPeriodSeconds) % 1) * 1.4 - 0.2 : -1;

    applyHologramFrame({ materials, reveal: Math.min(reveal, 1), scan });
  });

  return { rootRef, turretRef };
};
