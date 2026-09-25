'use client';

import type { PointerEvent } from 'react';

import { useState } from 'react';

import type { MapSquare } from '../../../lib/map-grid';

import { squareAt } from '../../../lib/map-grid';

export const useMapCursor = () => {
  const [square, setSquare] = useState<MapSquare | null>(null);

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const next = squareAt({ x: (event.clientX - rect.left) / rect.width, y: (event.clientY - rect.top) / rect.height });

    setSquare((current) => (current?.label === next.label ? current : next));
  };

  const onPointerLeave = () => setSquare(null);

  return { square, onPointerMove, onPointerLeave };
};
