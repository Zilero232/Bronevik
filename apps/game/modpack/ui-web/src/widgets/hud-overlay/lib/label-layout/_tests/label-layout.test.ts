import { describe, expect, it } from 'vitest';

import type { HudPanel } from '../../../../../shared/api/hud-protocol';

import { HUD_OVERLAY } from '../../../config';
import { labelStyle, layoutLabels } from '../label-layout';

const SCREEN = { width: 1920, height: 1080 };

const panel = (overrides: Partial<HudPanel>): HudPanel => ({
  id: 'otmetki.hud.panel',
  text: 'text',
  x: 0,
  y: 400,
  align_x: 'center',
  align_y: 'top',
  alpha: 1,
  drag: false,
  border: false,
  visible: true,
  scale: 1,
  kind: 'label',
  widget: null,
  ...overrides
});

const layoutOf = (shown: HudPanel, edit = false) =>
  layoutLabels({
    panels: [shown],
    sizes: { [shown.id]: { lines: 1, width: 200, height: 40 } },
    scales: {},
    overrides: {},
    screen: SCREEN,
    live: null,
    edit,
    widgets: new Map()
  })[0];

const opacityOf = (shown: HudPanel): number | undefined => layoutOf(shown)?.style.opacity;

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

describe(layoutLabels, () => {
  it('dims a panel under the full stats while Tab is held', () => {
    expect(opacityOf(panel({ dim: true }))).toBe(HUD_OVERLAY.fullStats.alpha);
  });

  it('keeps a panel clear of the full stats at full opacity while Tab is held', () => {
    expect(opacityOf(panel({ dim: true, align_x: 'left', y: 1000 }))).toBe(1);
  });

  it('draws a panel at full opacity once Tab is released', () => {
    expect(opacityOf(panel({ dim: false }))).toBe(1);
  });

  it('keeps a hidden panel laid out in its place, drawn transparent', () => {
    const shown = layoutOf(panel({}));
    const hidden = layoutOf(panel({ visible: false }));

    expect(hidden?.rect).toEqual(shown?.rect);
    expect(hidden?.style.opacity).toBe(HUD_OVERLAY.hidden);
  });

  it('takes no drag on a hidden panel', () => {
    expect(layoutOf(panel({ visible: false, drag: true }), true)?.movable).toBe(false);
  });

  it('takes no click on a hidden button', () => {
    expect(layoutOf(panel({ visible: false, kind: 'button' }))?.button).toBe(false);
  });
});
