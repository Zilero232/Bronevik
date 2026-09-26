import { describe, expect, it } from 'vitest';

import type { TacticIcon } from '@/entities/tactic/board';

import { CANVAS_FALLBACK } from '../../../config';
import { iconAppearance, strokeGeometry } from '../shape-geometry';

const ICON: TacticIcon = { id: 'i', kind: 'heavyTank', team: 1, x: 0, y: 0, rotation: 0 };

describe('strokeGeometry', () => {
  it('grows text with the stroke width', () => {
    const thin = strokeGeometry({ id: 's', tool: 'text', color: '#fff', width: 2, points: [0, 0], text: 'a' });
    const thick = strokeGeometry({ id: 's', tool: 'text', color: '#fff', width: 8, points: [0, 0], text: 'a' });

    expect(thick.fontSize).toBeGreaterThan(thin.fontSize);
  });
});

describe('iconAppearance', () => {
  it('fills tank glyphs with the team colour', () => {
    expect(iconAppearance({ icon: ICON, palette: CANVAS_FALLBACK }).fill).toBe(CANVAS_FALLBACK.enemy);
  });

  it('outlines the marker in the team colour instead of filling it', () => {
    const appearance = iconAppearance({ icon: { ...ICON, kind: 'marker', team: 0 }, palette: CANVAS_FALLBACK });

    expect(appearance.fill).toBeUndefined();
    expect(appearance.stroke).toBe(CANVAS_FALLBACK.ally);
  });

  it('treats an unknown team index as neutral', () => {
    expect(iconAppearance({ icon: { ...ICON, team: 7 }, palette: CANVAS_FALLBACK }).fill).toBe(CANVAS_FALLBACK.neutral);
  });
});
