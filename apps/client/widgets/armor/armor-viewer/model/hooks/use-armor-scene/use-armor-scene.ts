'use client';

import type { ThreeEvent } from '@react-three/fiber';

import { useThree } from '@react-three/fiber';
import { useEffect, useState } from 'react';

import type { UseArmorSceneInput } from './use-armor-scene.types';

import { applyShaderValues, createArmorMaterial } from '../../../lib/armor-material';
import { collectRayHits } from '../../../lib/scene-hits';

export const useArmorScene = ({ parts, shader, onHover }: UseArmorSceneInput) => {
  'use no memo';

  const invalidate = useThree((state) => state.invalidate);
  const [material] = useState(() => createArmorMaterial(shader));

  useEffect(() => () => material.dispose(), [material]);

  useEffect(() => {
    applyShaderValues({ material, values: shader });
    invalidate();
  }, [material, shader, invalidate]);

  const onPointerMove = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();

    const hits = collectRayHits({ intersections: event.intersections, parts, direction: event.ray.direction });
    const target = event.nativeEvent.target;

    onHover({ hits, x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY, width: target instanceof HTMLElement ? target.clientWidth : 0 });
  };

  return { material, onPointerMove };
};
