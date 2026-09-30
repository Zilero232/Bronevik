import { describe, expect, it } from 'vitest';

import { UI_ICONS } from '../../../../src/shared/config';
import { spriteSize } from '../../../../src/shared/lib/icon-sprite';
import { loadIconNodes, parseIconModule, spritePng, spriteSvg } from '../icon-sprite';

const PNG_SIGNATURE = [137, 80, 78, 71, 13, 10, 26, 10];
const COLORS = new Map([
  ['muted', '#a3a3ad'],
  ['text', '#f2f2f3'],
  ['accent', '#ff7a1a'],
  ['contrast', '#1a0b00'],
  ['success', '#6fb544'],
  ['danger', '#f1705b']
]);

describe('icon sprite', () => {
  it('reads the geometry of a lucide icon module', () => {
    const source = [
      'const __iconData = { name: "x", node: [',
      '  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],',
      '  ["circle", { cx: "12", cy: "12", r: "10", key: "a" }],',
      '  ["line", { x1: "22", x2: "18", y1: "12", y2: "12", key: "b" }]',
      '] };'
    ].join('\n');

    expect(parseIconModule(source)).toEqual([
      ['path', { d: 'M18 6 6 18', key: '1bl5f8' }],
      ['circle', { cx: '12', cy: '12', r: '10', key: 'a' }],
      ['line', { x1: '22', x2: '18', y1: '12', y2: '12', key: 'b' }]
    ]);
  });

  it('finds geometry for every icon the pages use', () => {
    const nodes = loadIconNodes();

    UI_ICONS.names.forEach((name) => expect(nodes.get(name)?.length, name).toBeGreaterThan(0));
  });

  it('draws every icon once per tone', () => {
    const svg = spriteSvg({ nodes: loadIconNodes(), colors: COLORS });

    expect(svg.match(/<g /g)).toHaveLength(UI_ICONS.names.length * UI_ICONS.tones.length);
    expect(svg).not.toContain(' key=');
  });

  it('rasterises into one PNG of the sprite size', () => {
    const png = spritePng({ nodes: loadIconNodes(), colors: COLORS });
    const header = new DataView(png.buffer, png.byteOffset, png.byteLength);
    const { columns, rows } = spriteSize();

    expect(Array.from(png.subarray(0, 8))).toEqual(PNG_SIGNATURE);
    expect([header.getUint32(16), header.getUint32(20)]).toEqual([columns * UI_ICONS.cell, rows * UI_ICONS.cell]);
  }, 30_000);
});
