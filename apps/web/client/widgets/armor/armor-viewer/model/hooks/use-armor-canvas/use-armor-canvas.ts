'use client';

import type { OrbitControls } from '@react-three/drei';
import type { ComponentRef, KeyboardEvent } from 'react';

import { useMediaQuery } from '@siberiacancode/reactuse';
import { useReducedMotion } from 'motion/react';
import { useMemo, useRef } from 'react';

import { armorShaderValues } from '@/entities/armor/armor-model';
import { ARMOR_LAYERS, useArmorAttack, useArmorInspect } from '@/features/armor/armor-inspect';

import type { UseArmorCanvasInput } from './use-armor-canvas.types';

import { ARMOR_CANVAS, NO_SHELL, ORBIT_KEYS } from '../../../config';
import { presetPosition } from '../../../lib/camera-presets';
import { modelBounds, sceneParts } from '../../../lib/scene-parts';
import { useArmorHover } from '../use-armor-hover';

export const useArmorCanvas = ({ geometry, handles, onPreset }: UseArmorCanvasInput) => {
  const { modules, turret, gun } = useArmorInspect();
  const { layers, heatmap, shellState = NO_SHELL } = useArmorAttack();
  const reducedMotion = useReducedMotion() ?? false;
  const isLowDetail = useMediaQuery(ARMOR_CANVAS.lowDetailQuery);
  const hideSpaced = !layers.includes('spaced');
  const { hover, onHover, onLeave } = useArmorHover({ shellState, hideSpaced });
  const controlsRef = useRef<ComponentRef<typeof OrbitControls>>(null);
  const bounds = useMemo(() => modelBounds(sceneParts({ geometry, modules, turret, gun, layers: ARMOR_LAYERS })), [geometry, modules, turret, gun]);

  const parts = sceneParts({ geometry, modules, turret, gun, layers });
  const shader = armorShaderValues({ ...shellState, hideSpaced, heatmap });
  const initialPosition = presetPosition({ preset: 'initial', ...bounds });
  const [minDpr, maxDpr] = isLowDetail ? ARMOR_CANVAS.lowDetailDpr : ARMOR_CANVAS.dpr;
  const dpr: [number, number] = [minDpr, maxDpr];

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === ARMOR_CANVAS.homeKey) {
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

  return { hover, onHover, onLeave, controlsRef, bounds, parts, shader, initialPosition, reducedMotion, dpr, isLowDetail, onKeyDown };
};
