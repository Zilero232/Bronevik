import clsx from 'clsx';

import type { GlyphProps } from './Glyph.types';

import { HUD_GLYPHS } from '../../../config';
import { glyphPaths } from '../../../lib/hud-glyph';

import s from './Glyph.module.scss';

export const Glyph = ({ name, size, className }: GlyphProps) => {
  const { shapes, details } = glyphPaths(name);

  return (
    <span className={clsx(s.glyph, className)} style={{ width: `${size}rem`, height: `${size}rem` }}>
      <svg
        aria-hidden='true'
        height='100%'
        viewBox={`0 0 ${HUD_GLYPHS.viewBox} ${HUD_GLYPHS.viewBox}`}
        width='100%'
        xmlns='http://www.w3.org/2000/svg'
      >
        {shapes.map((d) => (
          <path key={d} d={d} fill='currentColor' stroke={HUD_GLYPHS.outline} stroke-linejoin='round' stroke-width={HUD_GLYPHS.outlineWidth} />
        ))}
        {details.map((d) => (
          <path key={d} d={d} fill={HUD_GLYPHS.outline} />
        ))}
      </svg>
    </span>
  );
};
