'use client';

import { useReducedMotion } from 'motion/react';
import { useEffect, useRef } from 'react';

import type { Tracer } from '../battle-backdrop';
import type { UseBattleBackdropInput } from './use-battle-backdrop.types';

import { BATTLE_BACKDROP, contourSegments, createMotes, createTracer, stepMotes } from '../battle-backdrop';
import { paintContours, paintMotion } from '../battle-backdrop-paint';
import { seededRandom } from '../seeded-random';

export const useBattleBackdrop = ({ seed, density }: UseBattleBackdropInput) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLCanvasElement>(null);
  const motionRef = useRef<HTMLCanvasElement>(null);
  const isReduced = useReducedMotion() ?? false;

  useEffect(() => {
    const root = rootRef.current;
    const field = fieldRef.current?.getContext('2d');
    const layer = motionRef.current?.getContext('2d');

    if (!root || !field || !layer) {
      return;
    }

    const { dust, smoke, cols, rows } = BATTLE_BACKDROP.density[density];
    const { tracer: tracerConfig } = BATTLE_BACKDROP;
    const segments = contourSegments({ seed, cols, rows, levels: BATTLE_BACKDROP.levels });
    const motes = createMotes({ seed, dust, smoke });
    const random = seededRandom(seed * 7919 + 17);
    const state = { width: 0, height: 0, color: '', tracerColor: '', frame: 0, last: 0, isRunning: false, isVisible: false, nextTracer: 0 };
    let tracers: Tracer[] = [];

    const seconds = () => performance.now() / 1000;
    const drawMotion = () =>
      paintMotion({
        context: layer,
        width: state.width,
        height: state.height,
        motes,
        tracers,
        now: seconds(),
        color: state.color,
        tracerColor: state.tracerColor
      });

    const resize = () => {
      const styles = window.getComputedStyle(root);
      const ratio = Math.min(window.devicePixelRatio || 1, BATTLE_BACKDROP.dpr);

      state.width = root.clientWidth;
      state.height = root.clientHeight;
      state.color = styles.color;
      state.tracerColor = styles.getPropertyValue('--color-accent').trim() || state.color;

      for (const context of [field, layer]) {
        context.canvas.width = Math.round(state.width * ratio);
        context.canvas.height = Math.round(state.height * ratio);
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
      }

      paintContours({ context: field, width: state.width, height: state.height, segments, color: state.color });
      drawMotion();
    };

    const tick = (time: number) => {
      state.frame = window.requestAnimationFrame(tick);

      if (time - state.last < 1000 / BATTLE_BACKDROP.fps) {
        return;
      }

      const now = time / 1000;

      stepMotes({ motes, seconds: Math.min((time - state.last) / 1000, 0.1) });
      state.last = time;

      if (now >= state.nextTracer) {
        tracers = [...tracers.filter((tracer) => now - tracer.born < tracer.life), createTracer({ random, now, life: tracerConfig.life })];
        state.nextTracer = now + tracerConfig.minGap + random() * (tracerConfig.maxGap - tracerConfig.minGap);
      }

      drawMotion();
    };

    const sync = () => {
      const shouldRun = !isReduced && state.isVisible && !document.hidden;

      if (shouldRun === state.isRunning) {
        return;
      }

      state.isRunning = shouldRun;

      if (shouldRun) {
        state.last = performance.now();
        state.nextTracer = Math.max(state.nextTracer, seconds() + tracerConfig.minGap / 2);
        state.frame = window.requestAnimationFrame(tick);
      } else {
        window.cancelAnimationFrame(state.frame);
      }
    };

    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      state.isVisible = entry?.isIntersecting ?? false;
      sync();
    });

    resizeObserver.observe(root);
    intersectionObserver.observe(root);
    document.addEventListener('visibilitychange', sync);

    return () => {
      window.cancelAnimationFrame(state.frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  }, [seed, density, isReduced]);

  return { rootRef, fieldRef, motionRef };
};
