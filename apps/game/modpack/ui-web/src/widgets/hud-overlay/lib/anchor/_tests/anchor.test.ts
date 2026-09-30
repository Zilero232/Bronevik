import { describe, expect, it } from 'vitest';

import type { Anchor } from '../anchor.types';

import { panelRect, placementOf } from '../../../../../shared/lib/hud-geometry';
import { designScreen } from '../../../../../shared/lib/hud-screen';
import { designRect, placeRect, rectStyle } from '../anchor';

const RESOLUTIONS = [
  { width: 1280, height: 720 },
  { width: 1366, height: 768 },
  { width: 1600, height: 900 },
  { width: 1920, height: 1080 },
  { width: 2560, height: 1440 },
  { width: 3440, height: 1440 },
  { width: 3840, height: 2160 }
];

const SCALES = [1, 1.25, 1.5, 1.75, 2];

const FALLBACK = { width: 1920, height: 1080 };

const DEFAULTS: Anchor[] = [
  { x: -20, y: 120, align_x: 'right', align_y: 'top' },
  { x: -24, y: 72, align_x: 'right', align_y: 'top' },
  { x: 20, y: -140, align_x: 'left', align_y: 'bottom' },
  { x: 0, y: 120, align_x: 'center', align_y: 'top' },
  { x: 5, y: -5, align_x: 'center', align_y: 'center' }
];

const SIZE = { width: 220, height: 80 };

const inside = (rect: { left: number; top: number; width: number; height: number }, screen: { width: number; height: number }): boolean =>
  rect.left >= 0 && rect.top >= 0 && rect.left + rect.width <= screen.width && rect.top + rect.height <= screen.height;

describe(placeRect, () => {
  it('places a panel from its anchor and its measured size', () => {
    const screen = { width: 1920, height: 1080 };

    expect(placeRect({ anchor: DEFAULTS[0]!, size: SIZE, screen })).toEqual({ left: 1680, top: 120, width: 220, height: 80 });
    expect(placeRect({ anchor: DEFAULTS[2]!, size: SIZE, screen })).toEqual({ left: 20, top: 860, width: 220, height: 80 });
    expect(placeRect({ anchor: DEFAULTS[3]!, size: SIZE, screen })).toEqual({ left: 850, top: 120, width: 220, height: 80 });
  });

  it('keeps every default panel whole on every common resolution and interface scale', () => {
    for (const client of RESOLUTIONS) {
      for (const scale of SCALES) {
        const screen = designScreen({ client, scale, fallback: FALLBACK });

        for (const anchor of DEFAULTS) {
          expect(inside(placeRect({ anchor, size: SIZE, screen }), screen), `${client.width}x${client.height} @${scale}`).toBe(true);
        }
      }
    }
  });

  it('pulls a panel saved on a bigger screen back into a smaller one', () => {
    const saved = placementOf({ rect: { left: 3300, top: 2000, width: 220, height: 80 }, screen: { width: 3840, height: 2160 } });
    const small = designScreen({ client: { width: 1280, height: 720 }, scale: 2, fallback: FALLBACK });
    const lost: Anchor = { x: 3000, y: 2000, align_x: 'left', align_y: 'top' };

    expect(inside(placeRect({ anchor: saved, size: SIZE, screen: small }), small)).toBe(true);
    expect(placeRect({ anchor: lost, size: SIZE, screen: small })).toEqual({ left: 420, top: 280, width: 220, height: 80 });
  });

  it('keeps the team HP strip (its default is x 0, top centre) centred on the stock score strip on every screen', () => {
    for (const client of RESOLUTIONS) {
      for (const scale of SCALES) {
        const screen = designScreen({ client, scale, fallback: FALLBACK });
        const rect = placeRect({ anchor: { x: 0, y: 4, align_x: 'center', align_y: 'top' }, size: { width: 590, height: 44 }, screen });

        expect(rect.left + rect.width / 2, `${client.width}x${client.height} @${scale}`).toBeCloseTo(screen.width / 2, 5);
        expect(rect.top).toBe(4);
      }
    }
  });

  it('keeps a right-anchored panel at the same distance from the right edge on every width', () => {
    for (const client of RESOLUTIONS) {
      const screen = designScreen({ client, scale: 1, fallback: FALLBACK });
      const rect = placeRect({ anchor: DEFAULTS[0]!, size: SIZE, screen });

      expect(screen.width - rect.left - rect.width).toBe(20);
    }
  });

  it('agrees with the HUD editor geometry for every anchor', () => {
    const screen = { width: 1920, height: 1080 };
    const rect = { left: 1500, top: 900, width: 300, height: 60 };
    const placement = placementOf({ rect, screen });

    expect(placement).toMatchObject({ align_x: 'right', align_y: 'bottom' });
    expect(panelRect({ panel: { ...placement, width: rect.width, height: rect.height }, screen })).toEqual(rect);
    expect(placeRect({ anchor: placement, size: rect, screen })).toEqual(rect);
  });
});

describe('page units', () => {
  it('turns page pixels into design pixels and rects into whole rem', () => {
    expect(designRect({ box: { left: 20, top: 40, width: 200, height: 60 }, scale: 2 })).toEqual({ left: 10, top: 20, width: 100, height: 30 });
    expect(rectStyle({ rect: { left: 1.4, top: 2.6, width: 3, height: 4 } })).toEqual({ left: '1rem', top: '3rem' });
  });
});
