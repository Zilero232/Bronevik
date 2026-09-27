import type { MapNeighbours, MapNeighboursInput } from './map-neighbours.types';

export const mapNeighbours = <T>({ items, index }: MapNeighboursInput<T>): MapNeighbours<T> => {
  if (index < 0 || items.length < 2) {
    return { prev: null, next: null };
  }

  const { length } = items;

  return {
    prev: items[(index - 1 + length) % length] ?? null,
    next: items[(index + 1) % length] ?? null
  };
};
