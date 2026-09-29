'use client';

import { useGuessMap } from '../../context';

export const useMapFragment = () => {
  const { target, focus, zoom, status } = useGuessMap();

  return {
    image: target.image,
    name: target.name,
    zoom,
    status,
    isOver: status !== 'playing',
    origin: `${focus.x * 100}% ${focus.y * 100}%`
  };
};
