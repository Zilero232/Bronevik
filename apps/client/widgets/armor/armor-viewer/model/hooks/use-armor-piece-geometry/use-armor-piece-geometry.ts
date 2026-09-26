'use client';

import { useEffect, useMemo } from 'react';

import { buildPieceBuffers } from '@/entities/armor/armor-model';

import type { UseArmorPieceGeometryInput } from './use-armor-piece-geometry.types';

import { toBufferGeometry } from '../../../lib/piece-geometry';

export const useArmorPieceGeometry = ({ piece, plates }: UseArmorPieceGeometryInput) => {
  'use no memo';

  const geometry = useMemo(() => toBufferGeometry(buildPieceBuffers({ piece, plates })), [piece, plates]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return geometry;
};
