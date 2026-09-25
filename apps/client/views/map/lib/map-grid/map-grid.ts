import { clamp } from 'remeda';

import type { MapSquare, SquareAtInput, SquareLabelInput } from './map-grid.types';

import { MAP_GRID } from '../../config';

const SIDE = MAP_GRID.rows.length;

const indexOf = (fraction: number) => clamp(Math.floor(fraction * SIDE), { min: 0, max: SIDE - 1 });

export const squareLabel = ({ row, column }: SquareLabelInput) => `${MAP_GRID.rows[row] ?? ''}${MAP_GRID.columns[column] ?? ''}`;

export const squareAt = ({ x, y }: SquareAtInput): MapSquare => {
  const row = indexOf(y);
  const column = indexOf(x);

  return { row, column, label: squareLabel({ row, column }) };
};

export const squareMeters = (mapSize: number) => mapSize / SIDE;
