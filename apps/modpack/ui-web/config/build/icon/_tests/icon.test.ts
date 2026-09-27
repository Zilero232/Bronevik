import { decode } from 'fast-png';
import { describe, expect, it } from 'vitest';

import { hexColor, iconPng } from '../icon';
import { ICON } from '../icon.constants';

describe('iconPng', () => {
  it('draws the /// mark on the rounded dark tile', () => {
    const accent = hexColor('#ff7a1a');
    const background = hexColor('#0e0e10');
    const image = decode(iconPng({ accent, background }));
    const pixel = ({ x, y }: { x: number; y: number }): number[] =>
      Array.from(image.data.slice((y * ICON.size + x) * 4, (y * ICON.size + x) * 4 + 4));

    expect([image.width, image.height, image.channels]).toEqual([ICON.size, ICON.size, 4]);
    expect(pixel({ x: 0, y: 0 })).toEqual([0, 0, 0, 0]);
    expect(pixel({ x: 4, y: 24 })).toEqual(background);
    expect(image.data.some((_, index) => index % 4 === 0 && image.data[index] === 255 && image.data[index + 1] === 122)).toBe(true);
  });

  it('reads hex colours', () => {
    expect(hexColor('#ff7a1a')).toEqual([255, 122, 26, 255]);
  });
});
