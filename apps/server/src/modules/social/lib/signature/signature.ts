import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';

import type { SignatureData } from '../../social.types';
import type { NodeInput, RenderSignatureInput, SignatureNode, StatInput } from './signature.types';

import { ratingValue } from '../../../../common/lib';
import { SIGNATURE, TIER_COLORS } from '../../config';

const div = ({ style, children }: NodeInput): SignatureNode => ({
  type: 'div',
  key: null,
  props: { style, ...(children === undefined ? {} : { children }) }
});

const format = (value: number | null): string => (value === null ? '—' : Math.round(value).toLocaleString('ru-RU'));

const percent = (value: number | null): string => (value === null ? '—' : `${(value * 100).toFixed(2)}%`);

const stat = ({ label, value, color }: StatInput): SignatureNode =>
  div({
    style: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginRight: 22 },
    children: [
      div({ style: { fontSize: 11, color: SIGNATURE.muted }, children: label }),
      div({ style: { fontSize: 22, color, fontFamily: SIGNATURE.fontNames.display }, children: value })
    ]
  });

export const signatureTree = (data: SignatureData): SignatureNode => {
  const tier = ratingValue({ kind: 'wn8', value: data.wn8 }).tier;
  const wn8Color = tier ? TIER_COLORS[tier] : SIGNATURE.foreground;

  return div({
    style: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      width: SIGNATURE.width,
      height: SIGNATURE.height,
      padding: '10px 14px',
      backgroundColor: SIGNATURE.background,
      color: SIGNATURE.foreground,
      fontFamily: SIGNATURE.fontNames.body,
      borderLeft: `4px solid ${wn8Color}`
    },
    children: [
      div({
        style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' },
        children: [
          div({
            style: { fontSize: 18, fontFamily: SIGNATURE.fontNames.display },
            children: data.clanTag ? `${data.nickname} [${data.clanTag}]` : data.nickname
          }),
          div({ style: { fontSize: 11, color: SIGNATURE.accent }, children: SIGNATURE.brand })
        ]
      }),
      div({
        style: { display: 'flex' },
        children: [
          stat({ label: 'WN8', value: format(data.wn8), color: wn8Color }),
          stat({ label: 'WR', value: percent(data.winRate), color: SIGNATURE.foreground }),
          stat({ label: 'DMG', value: format(data.avgDamage), color: SIGNATURE.foreground }),
          stat({ label: 'BATTLES', value: format(data.battles), color: SIGNATURE.foreground })
        ]
      })
    ]
  });
};

export const renderSignature = async ({ data, fonts }: RenderSignatureInput): Promise<Buffer> => {
  const svg = await satori(signatureTree(data), { width: SIGNATURE.width, height: SIGNATURE.height, fonts: [...fonts] });

  return new Resvg(svg, { fitTo: { mode: 'original' } }).render().asPng();
};
