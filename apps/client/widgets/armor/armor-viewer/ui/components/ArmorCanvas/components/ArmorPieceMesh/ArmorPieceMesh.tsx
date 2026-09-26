'use client';

import { useEffect, useMemo } from 'react';

import { buildPieceBuffers } from '@/entities/armor/armor-model';

import type { ArmorPieceMeshProps } from './ArmorPieceMesh.types';

import { toBufferGeometry } from './ArmorPieceMesh.helpers';

export const ArmorPieceMesh = ({ part, material, onPointerMove, onPointerOut }: ArmorPieceMeshProps) => {
  'use no memo';

  const { piece, plates, position } = part;
  const geometry = useMemo(() => toBufferGeometry(buildPieceBuffers({ piece, plates })), [piece, plates]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <mesh geometry={geometry} material={material} name={piece.name} position={position} onPointerMove={onPointerMove} onPointerOut={onPointerOut} />
  );
};
