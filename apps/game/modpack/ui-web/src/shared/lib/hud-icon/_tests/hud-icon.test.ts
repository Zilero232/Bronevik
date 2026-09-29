import { describe, expect, it } from 'vitest';

import { parseIcon } from '../hud-icon';

describe(parseIcon, () => {
  it('splits a client image from its fallback glyph', () => {
    expect(parseIcon('img://gui/maps/icons/vehicleTypes/red/at-spg.png|otmetki:class_td')).toEqual({
      image: 'img://gui/maps/icons/vehicleTypes/red/at-spg.png',
      glyph: 'class_td'
    });

    expect(parseIcon('img://gui/maps/icons/artefact/rammer.png')).toEqual({ image: 'img://gui/maps/icons/artefact/rammer.png', glyph: null });
  });

  it('reads a glyph alone and nothing', () => {
    expect(parseIcon('otmetki:fire')).toEqual({ image: null, glyph: 'fire' });
    expect(parseIcon(null)).toEqual({ image: null, glyph: null });
    expect(parseIcon('http://example.com/x.png')).toEqual({ image: null, glyph: null });
  });
});
