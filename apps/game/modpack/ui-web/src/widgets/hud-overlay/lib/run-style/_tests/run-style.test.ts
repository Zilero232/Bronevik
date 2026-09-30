import { describe, expect, it } from 'vitest';

import { imageStyle, textStyle } from '../run-style';

describe(textStyle, () => {
  it('ships the colour and the size as rem', () => {
    const run = { key: '0.0', kind: 'text', text: 'a', style: { color: '#F2EAD3', size: 16 } } as const;

    expect(textStyle(run)).toEqual({ color: '#F2EAD3', fontSize: '16rem' });
  });

  it('leaves unset values out', () => {
    const run = { key: '0.0', kind: 'text', text: 'a', style: {} } as const;

    expect(textStyle(run)).toEqual({ color: undefined, fontSize: undefined });
  });
});

describe(imageStyle, () => {
  it('ships the set side as rem and leaves the other out', () => {
    const run = { key: '0', kind: 'image', src: 'img://a.png', width: 32 } as const;

    expect(imageStyle(run)).toEqual({ width: '32rem', height: undefined });
  });
});
