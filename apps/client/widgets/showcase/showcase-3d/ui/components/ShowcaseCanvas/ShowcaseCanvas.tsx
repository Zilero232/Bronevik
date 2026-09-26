'use client';

import { Canvas } from '@react-three/fiber';

import type { ShowcaseCanvasProps } from './ShowcaseCanvas.types';

import { SHOWCASE_CANVAS } from '../../../config';
import { HologramTank } from './components';

import s from './ShowcaseCanvas.module.scss';

export const ShowcaseCanvas = ({ slug, mode, isActive, drag, onReady }: ShowcaseCanvasProps) => (
  <Canvas
    aria-hidden
    camera={{ fov: SHOWCASE_CANVAS.fov, near: SHOWCASE_CANVAS.near, far: SHOWCASE_CANVAS.far }}
    className={s.root}
    dpr={[...SHOWCASE_CANVAS.dpr]}
    frameloop={mode === 'live' && isActive ? 'always' : 'demand'}
    gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
  >
    <HologramTank drag={drag} isLive={mode === 'live'} slug={slug} onReady={onReady} />
  </Canvas>
);
