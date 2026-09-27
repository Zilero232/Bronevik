'use client';

import { AdaptiveDpr, OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useTranslations } from 'next-intl';

import { HitReadout } from '@/features/armor/armor-inspect';

import type { ArmorCanvasProps } from './ArmorCanvas.types';

import { ARMOR_CAMERA, ARMOR_CANVAS } from '../../../config';
import { useArmorCanvas } from '../../../model/hooks';
import { ArmorScene, CameraBridge } from './components';

import s from './ArmorCanvas.module.scss';

export const ArmorCanvas = ({ geometry, command, handles, onPreset }: ArmorCanvasProps) => {
  const t = useTranslations('armor.controls');
  const { hover, onHover, onLeave, controlsRef, bounds, parts, shader, initialPosition, reducedMotion, onKeyDown } = useArmorCanvas({
    geometry,
    handles,
    onPreset
  });

  return (
    <div className={s.root}>
      <Canvas
        aria-label={t('canvas')}
        camera={{ fov: ARMOR_CAMERA.fov, near: ARMOR_CAMERA.near, far: ARMOR_CAMERA.far, position: initialPosition }}
        className={s.canvas}
        dpr={[...ARMOR_CANVAS.dpr]}
        frameloop='demand'
        role='application'
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerLeave={onLeave}
      >
        <AdaptiveDpr pixelated />
        <ArmorScene parts={parts} shader={shader} onHover={onHover} onLeave={onLeave} />
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
        <div className={s.tooltip} data-flip={hover.flip} style={{ '--x': `${hover.x}px`, '--y': `${hover.y}px` }}>
          <HitReadout pieceKind={hover.kind} report={hover.report} />
        </div>
      )}
    </div>
  );
};
