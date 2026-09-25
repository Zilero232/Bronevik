import { round } from 'remeda';

import type { GlyphPathInput } from './icon.types';

import { toRoman } from './roman';

const GLYPH = {
  top: 7,
  bottom: 17,
  width: 6,
  gap: 2.6,
  rail: 1.6,
  minHalfRail: 4,
  center: 12
} as const;

const glyphWidth = (glyph: string) => (glyph === 'I' ? 0 : GLYPH.width);

const glyphPath = ({ glyph, x }: GlyphPathInput) => {
  if (glyph === 'I') {
    return `M${x} ${GLYPH.top}V${GLYPH.bottom}`;
  }

  if (glyph === 'V') {
    return `M${x} ${GLYPH.top}L${x + GLYPH.width / 2} ${GLYPH.bottom}L${x + GLYPH.width} ${GLYPH.top}`;
  }

  return `M${x} ${GLYPH.top}L${x + GLYPH.width} ${GLYPH.bottom}M${x + GLYPH.width} ${GLYPH.top}L${x} ${GLYPH.bottom}`;
};

export const tierGlyphs = (tier: number) => {
  const glyphs = [...toRoman(tier)];
  const total = glyphs.reduce((sum, glyph) => sum + glyphWidth(glyph), 0) + GLYPH.gap * (glyphs.length - 1);
  const start = GLYPH.center - total / 2;

  let cursor = start;

  const numeral = glyphs
    .map((glyph) => {
      const path = glyphPath({ glyph, x: round(cursor, 2) });

      cursor += glyphWidth(glyph) + GLYPH.gap;

      return path;
    })
    .join('');

  const left = round(Math.min(start - GLYPH.rail, GLYPH.center - GLYPH.minHalfRail), 2);
  const right = round(Math.max(start + total + GLYPH.rail, GLYPH.center + GLYPH.minHalfRail), 2);

  return {
    numeral,
    rails: `M${left} 4H${right}M${left} 20H${right}`
  };
};
