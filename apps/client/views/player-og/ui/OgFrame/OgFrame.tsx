import { OG_COLORS, OG_FONTS } from '@/shared/seo/og';

import type { OgFrameProps } from './OgFrame.types';

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
    <div style={{ display: 'flex', color: OG_COLORS.muted, fontFamily: OG_FONTS.display, fontSize: 28, letterSpacing: 2 }}>{heading}</div>
    {children}
    <div style={{ display: 'flex', justifyContent: 'space-between', color: OG_COLORS.dim, fontSize: 22 }}>{footer}</div>
  </div>
);
