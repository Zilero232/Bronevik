import { describe, expect, it } from 'vitest';

import { imageStyle, textStyle } from '../run-style';

describe('run styles', () => {
  it('ships sizes as rem and leaves unset values out', () => {
    expect(textStyle({ kind: 'text', text: 'a', style: { color: '#F2EAD3', size: 16 } })).toEqual({ color: '#F2EAD3', fontSize: '16rem' });
    expect(textStyle({ kind: 'text', text: 'a', style: {} })).toEqual({ color: undefined, fontSize: undefined });
    expect(imageStyle({ kind: 'image', src: 'img://a.png', width: 32 })).toEqual({ width: '32rem', height: undefined });
  });
});
