import { describe, expect, it } from 'vitest';

import { glyphPaths, hasGlyph } from '../hud-glyph';

const NEW_GLYPHS = ['fire', 'fall', 'ammo_rack', 'record', 'target', 'wn8', 'session', 'traverse', 'bush', 'mission'];

describe(glyphPaths, () => {
  it('draws every glyph of the redesign spec', () => {
    NEW_GLYPHS.forEach((name) => expect(hasGlyph(name), name).toBe(true));
  });

  it('falls back to the shell for an unknown name and adds the dark details', () => {
    expect(glyphPaths('nope').shapes).toEqual(glyphPaths('damage').shapes);
    expect(glyphPaths('mission').details).toHaveLength(3);
    expect(glyphPaths('fire').details).toEqual([]);
  });
});
