import { LOGO_SHAPES } from '@otmetki/icons';

import type { OgFrameProps } from './OgFrame.types';

import { OG_COLORS, OG_FONTS } from '../og.constants';

export const OgFrame = ({ heading, footer, children }: OgFrameProps) => (
  <div
    style={{
      display: 'flex',
      width: '100%',
      height: '100%',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '64px 72px',
      background: OG_COLORS.bg,
      color: OG_COLORS.text,
      fontFamily: OG_FONTS.body
    }}
  >
    <div
      style={{ display: 'flex', alignItems: 'center', gap: 16, color: OG_COLORS.muted, fontFamily: OG_FONTS.display, fontSize: 28, letterSpacing: 2 }}
    >
      <svg fill='none' height={36} stroke={OG_COLORS.accent} strokeLinecap='round' strokeWidth={2.5} viewBox='0 0 24 24' width={36}>
        {LOGO_SHAPES.marks.map((d) => (
          <path key={d} d={d} />
        ))}
      </svg>
      {heading}
    </div>
    {children}
    <div style={{ display: 'flex', justifyContent: 'space-between', color: OG_COLORS.dim, fontSize: 22 }}>{footer}</div>
  </div>
);
