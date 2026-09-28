import { describe, expect, it } from 'vitest';

import { panelRect, placementOf } from '../../../../../shared/lib/hud-geometry';
import { anchorStyle, designRect, designSize, rectStyle, rootScale } from '../anchor';

describe(anchorStyle, () => {
  it('places a panel from its anchor without knowing its size', () => {
    expect(anchorStyle({ x: 20, y: -140, align_x: 'left', align_y: 'bottom' })).toEqual({ left: '20rem', bottom: '140rem' });
    expect(anchorStyle({ x: -24, y: 260, align_x: 'right', align_y: 'top' })).toEqual({ right: '24rem', top: '260rem' });

    expect(anchorStyle({ x: 0, y: 120, align_x: 'center', align_y: 'top' })).toEqual({
      left: '50%',
      marginLeft: '0rem',
      top: '120rem',
      transform: 'translateX(-50%)'
    });

    expect(anchorStyle({ x: 5, y: -5, align_x: 'center', align_y: 'center' })).toMatchObject({
      marginTop: '-5rem',
      transform: 'translate(-50%, -50%)'
    });

    expect(anchorStyle({ x: 5, y: 6, align_x: 'left', align_y: 'center' }).transform).toBe('translateY(-50%)');
  });

  it('agrees with the HUD editor geometry for every anchor', () => {
    const screen = { width: 1920, height: 1080 };
    const rect = { left: 1500, top: 900, width: 300, height: 60 };
    const placement = placementOf({ rect, screen });

    expect(placement).toMatchObject({ align_x: 'right', align_y: 'bottom' });
    expect(panelRect({ panel: { ...placement, width: rect.width, height: rect.height }, screen })).toEqual(rect);

    expect(anchorStyle(placement)).toEqual({
      right: `${screen.width - rect.left - rect.width}rem`,
      bottom: `${screen.height - rect.top - rect.height}rem`
    });
  });
});

describe('page units', () => {
  it('turns page pixels into design pixels', () => {
    expect(designRect({ box: { left: 20, top: 40, width: 200, height: 60 }, scale: 2 })).toEqual({ left: 10, top: 20, width: 100, height: 30 });
    expect(designSize({ width: 3840, height: 2160, scale: 2 })).toEqual({ width: 1920, height: 1080 });
    expect(rectStyle({ rect: { left: 1, top: 2, width: 3, height: 4 } })).toEqual({ left: '1rem', top: '2rem' });
  });

  it('reads the root font size, 1 when it is unusable', () => {
    expect(rootScale('1.25px')).toBe(1.25);
    expect(rootScale('')).toBe(1);
    expect(rootScale('0px')).toBe(1);
  });
});
