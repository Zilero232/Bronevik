'use client';

import type { ThreeEvent } from '@react-three/fiber';

import { useThree } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import { Mesh } from 'three';

import type { RayHit } from '../../../../../lib/ray-layers';
import type { ArmorSceneProps } from './ArmorScene.types';

import { ArmorPieceMesh } from '../ArmorPieceMesh';
import { applyShaderValues, createArmorMaterial } from './ArmorScene.helpers';

export const ArmorScene = ({ parts, shader, onHover, onLeave }: ArmorSceneProps) => {
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

    const hits = event.intersections.flatMap(({ object, faceIndex, face, distance }): RayHit[] => {
      const part = parts.find(({ piece }) => piece.name === object.name);

      if (!part || !(object instanceof Mesh) || faceIndex === undefined || faceIndex === null || !face) {
        return [];
      }

      const plateIndex = object.geometry.getAttribute('aPlate').getX(faceIndex * 3);
      const normal = face.normal.clone().transformDirection(object.matrixWorld);

      return [{ distance, piece: part.piece.name, kind: part.piece.kind, plate: part.plates[plateIndex], cosine: normal.dot(event.ray.direction) }];
    });

    const target = event.nativeEvent.target;

    onHover({ hits, x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY, width: target instanceof HTMLElement ? target.clientWidth : 0 });
  };

  return (
    <group>
      {parts.map((part) => (
        <ArmorPieceMesh key={part.layer} material={material} part={part} onPointerMove={onPointerMove} onPointerOut={onLeave} />
      ))}
    </group>
  );
};
