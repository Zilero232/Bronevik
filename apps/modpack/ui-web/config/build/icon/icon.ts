import { encode } from 'fast-png';

import type { IconColors, PixelInput, Rgba } from './icon.types';

import { ICON } from './icon.constants';

const insideRoundedSquare = ({ x, y }: Omit<PixelInput, 'colors'>): boolean => {
  const { size, radius } = ICON;
  const dx = Math.min(x, size - 1 - x);
  const dy = Math.min(y, size - 1 - y);

  return dx >= radius || dy >= radius || Math.hypot(dx - radius, dy - radius) <= radius;
};

const pixelOf = ({ x, y, colors }: PixelInput): Rgba => {
  const { size, stripe } = ICON;

  if (!insideRoundedSquare({ x, y })) {
    return [0, 0, 0, 0];
  }

  const slanted = x + (size - y) * stripe.slant;
  const onStripe = y >= stripe.top && y < size - stripe.top && stripe.starts.some((start) => slanted >= start && slanted < start + stripe.width);

  return onStripe ? colors.accent : colors.background;
};

export const hexColor = (hex: string): Rgba => {
  const value = hex.replace('#', '');

  return [Number.parseInt(value.slice(0, 2), 16), Number.parseInt(value.slice(2, 4), 16), Number.parseInt(value.slice(4, 6), 16), 255];
};

export const iconPng = (colors: IconColors): Uint8Array => {
  const { size } = ICON;
  const data = new Uint8Array(size * size * 4);

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      data.set(pixelOf({ x, y, colors }), (y * size + x) * 4);
    }
  }

  return encode({ width: size, height: size, data, channels: 4 });
};
