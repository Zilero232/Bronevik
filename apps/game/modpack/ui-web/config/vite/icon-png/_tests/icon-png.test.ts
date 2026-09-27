import { describe, expect, it } from 'vitest';

import { UI_BUILD } from '../../vite.constants';
import { iconPng } from '../icon-png';

const PNG_SIGNATURE = [137, 80, 78, 71, 13, 10, 26, 10];

describe('iconPng', () => {
  it('rasterises the logo mark into a square PNG of the ModsList size', () => {
    const png = iconPng({ background: '#0e0e10', accent: '#ff7a1a' });
    const header = new DataView(png.buffer, png.byteOffset, png.byteLength);

    expect(Array.from(png.subarray(0, 8))).toEqual(PNG_SIGNATURE);
    expect([header.getUint32(16), header.getUint32(20)]).toEqual([UI_BUILD.icon.size, UI_BUILD.icon.size]);
  });

  it('draws the same bytes for the same colours', () => {
    const colors = { background: '#0e0e10', accent: '#ff7a1a' };

    expect(Buffer.from(iconPng(colors)).equals(Buffer.from(iconPng(colors)))).toBe(true);
  });
});
