import { OG_FONTS } from '@/shared/seo/og';

import type { FallbackOgCardProps } from './FallbackOgCard.types';

import { OgFrame } from '../OgFrame';

export const FallbackOgCard = ({ labels, host }: FallbackOgCardProps) => (
  <OgFrame
    footer={
      <>
        <div style={{ display: 'flex' }}>{host}</div>
        <div style={{ display: 'flex' }}>{labels.player.source}</div>
      </>
    }
    heading={labels.brand}
  >
    <div style={{ display: 'flex', fontFamily: OG_FONTS.display, fontSize: 84, lineHeight: 1.05 }}>{labels.fallback}</div>
  </OgFrame>
);
