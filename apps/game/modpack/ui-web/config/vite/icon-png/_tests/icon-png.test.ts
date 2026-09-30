import { describe, expect, it } from 'vitest';

import { UI_BUILD } from '../../vite.constants';
import { iconPng } from '../icon-png';

const PNG_SIGNATURE = [137, 80, 78, 71, 13, 10, 26, 10];
const COLORS = { background: '#0e0e10', accent: '#ff7a1a' };

const pngSize = (png: Uint8Array) => {
  const header = new DataView(png.buffer, png.byteOffset, png.byteLength);

  return { width: header.getUint32(16), height: header.getUint32(20) };
};

describe('iconPng', () => {
  it('rasterises the logo mark into a PNG', () => {
    const png = iconPng(COLORS);

    expect(Array.from(png.subarray(0, 8))).toEqual(PNG_SIGNATURE);
  });

  it('draws a square of the ModsList icon size', () => {
    const png = iconPng(COLORS);

    expect(pngSize(png)).toEqual({ width: UI_BUILD.icon.size, height: UI_BUILD.icon.size });
  });

  it('draws the same bytes for the same colours', () => {
    const first = Buffer.from(iconPng(COLORS));
    const second = Buffer.from(iconPng(COLORS));

    expect(first.equals(second)).toBe(true);
  });
});
