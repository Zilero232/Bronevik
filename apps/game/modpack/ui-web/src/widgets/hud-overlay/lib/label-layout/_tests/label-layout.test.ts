import { describe, expect, it } from 'vitest';

import { labelStyle } from '../label-layout';

describe(labelStyle, () => {
  it('places a label at full size without a transform', () => {
    const style = labelStyle({ rect: { left: 10.4, top: 20.6, width: 100, height: 30 }, scale: 1, opacity: 0.8 });

    expect(style).toEqual({ left: '10rem', top: '21rem', opacity: 0.8 });
  });

  it('scales a resized label from its top-left corner', () => {
    const style = labelStyle({ rect: { left: 10, top: 20, width: 100, height: 30 }, scale: 1.5, opacity: 1 });

    expect(style).toEqual({ left: '10rem', top: '20rem', opacity: 1, transform: 'scale(1.5)', transformOrigin: '0 0' });
  });
});
