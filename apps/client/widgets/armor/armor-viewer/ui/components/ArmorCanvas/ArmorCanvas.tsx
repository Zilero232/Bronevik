'use client';

import type { ComponentRef, CSSProperties, KeyboardEvent } from 'react';

import { AdaptiveDpr, OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useReducedMotion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useMemo, useRef } from 'react';

import { armorShaderValues } from '@/entities/armor/armor-model';
import { ARMOR_LAYERS, HitReadout, useArmorInspect } from '@/features/armor/armor-inspect';

import type { ArmorCanvasProps } from './ArmorCanvas.types';

import { ARMOR_CAMERA, ARMOR_CANVAS, NO_SHELL, ORBIT_KEYS } from '../../../config/armor-viewer.config';
import { presetPosition } from '../../../lib/camera-presets';
import { modelBounds, sceneParts } from '../../../lib/scene-parts';
import { useArmorHover } from '../../../model/hooks';
import { ArmorScene, CameraBridge } from './components';

import s from './ArmorCanvas.module.scss';

export const ArmorCanvas = ({ geometry, command, handles, onPreset }: ArmorCanvasProps) => {
  const t = useTranslations('armor.controls');
  const { modules, turret, gun, layers, shellState = NO_SHELL } = useArmorInspect();
  const reducedMotion = useReducedMotion() ?? false;
  const hideSpaced = !layers.includes('spaced');
  const { hover, onHover, onLeave } = useArmorHover({ shellState, hideSpaced });
  const controlsRef = useRef<ComponentRef<typeof OrbitControls>>(null);
  const bounds = useMemo(() => modelBounds(sceneParts({ geometry, modules, turret, gun, layers: ARMOR_LAYERS })), [geometry, modules, turret, gun]);

  const parts = sceneParts({ geometry, modules, turret, gun, layers });

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Home') {
      event.preventDefault();
      onPreset('front');

      return;
    }

    const step = ORBIT_KEYS[event.key];

    if (step) {
      event.preventDefault();
      handles.current?.orbit(step);
    }
  };

  return (
    <div className={s.root}>
      <Canvas
        aria-label={t('canvas')}
        camera={{ fov: ARMOR_CAMERA.fov, near: ARMOR_CAMERA.near, far: ARMOR_CAMERA.far, position: presetPosition({ preset: 'initial', ...bounds }) }}
        className={s.canvas}
        dpr={[...ARMOR_CANVAS.dpr]}
        frameloop='demand'
        role='application'
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerLeave={onLeave}
      >
        <AdaptiveDpr pixelated />
        <ArmorScene parts={parts} shader={armorShaderValues({ ...shellState, hideSpaced })} onHover={onHover} onLeave={onLeave} />
        <OrbitControls
          makeDefault
          ref={controlsRef}
          enableDamping={!reducedMotion}
          maxDistance={bounds.radius * ARMOR_CAMERA.maxRadiusFactor}
          minDistance={ARMOR_CAMERA.minRadius}
        />
        <CameraBridge bounds={bounds} command={command} controlsRef={controlsRef} handles={handles} reducedMotion={reducedMotion} />
      </Canvas>
      {hover && (
        <div className={s.tooltip} data-flip={hover.flip} style={{ '--x': `${hover.x}px`, '--y': `${hover.y}px` } as CSSProperties}>
          <HitReadout pieceKind={hover.kind} report={hover.report} />
        </div>
      )}
    </div>
  );
};
