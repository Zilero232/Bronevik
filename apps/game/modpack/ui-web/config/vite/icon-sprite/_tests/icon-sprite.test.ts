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

const LUCIDE_MODULE = [
  'const __iconData = { name: "x", node: [',
  '  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],',
  '  ["circle", { cx: "12", cy: "12", r: "10", key: "a" }],',
  '  ["line", { x1: "22", x2: "18", y1: "12", y2: "12", key: "b" }]',
  '] };'
].join('\n');

const ICON_NODES = loadIconNodes();

const pngSize = (png: Uint8Array) => {
  const header = new DataView(png.buffer, png.byteOffset, png.byteLength);

  return { width: header.getUint32(16), height: header.getUint32(20) };
};

describe(parseIconModule, () => {
  it('reads the geometry of a lucide icon module', () => {
    const nodes = parseIconModule(LUCIDE_MODULE);

    expect(nodes).toEqual([
      ['path', { d: 'M18 6 6 18', key: '1bl5f8' }],
      ['circle', { cx: '12', cy: '12', r: '10', key: 'a' }],
      ['line', { x1: '22', x2: '18', y1: '12', y2: '12', key: 'b' }]
    ]);
  });
});

describe(loadIconNodes, () => {
  it.each(UI_ICONS.names)('finds geometry for the %s icon the pages use', (name) => {
    expect(ICON_NODES.get(name)?.length).toBeGreaterThan(0);
  });
});

describe(spriteSvg, () => {
  it('draws every icon once per tone', () => {
    const svg = spriteSvg({ nodes: ICON_NODES, colors: COLORS });

    expect(svg.match(/<g /g)).toHaveLength(UI_ICONS.names.length * UI_ICONS.tones.length);
  });

  it('leaves the lucide keys out of the markup', () => {
    const svg = spriteSvg({ nodes: ICON_NODES, colors: COLORS });

    expect(svg).not.toContain(' key=');
  });
});

describe(spritePng, () => {
  it('rasterises into one PNG of the sprite size', () => {
    const { columns, rows } = spriteSize();

    const png = spritePng({ nodes: ICON_NODES, colors: COLORS });

    expect(Array.from(png.subarray(0, 8))).toEqual(PNG_SIGNATURE);
    expect(pngSize(png)).toEqual({ width: columns * UI_ICONS.cell, height: rows * UI_ICONS.cell });
  }, 30_000);
});
