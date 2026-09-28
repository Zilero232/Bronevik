import { describe, expect, it } from 'vitest';

import { clampRect, dragRect, dragTo, moveMessage, panelRect, placementOf, stageScale } from '../hud-geometry';

const screen = { width: 1920, height: 1080 };

describe(panelRect, () => {
  it('anchors the offsets to the panel alignment', () => {
    expect(panelRect({ panel: { x: 10, y: 20, align_x: 'left', align_y: 'top', width: 200, height: 40 }, screen })).toEqual({
      left: 10,
      top: 20,
      width: 200,
      height: 40
    });

    expect(panelRect({ panel: { x: 0, y: 0, align_x: 'center', align_y: 'center', width: 200, height: 40 }, screen })).toMatchObject({
      left: 860,
      top: 520
    });

    expect(panelRect({ panel: { x: -20, y: -10, align_x: 'right', align_y: 'bottom', width: 200, height: 40 }, screen })).toMatchObject({
      left: 1700,
      top: 1030
    });
  });
});

describe(placementOf, () => {
  it('picks the nearest anchor so a panel stays put on another resolution', () => {
    expect(placementOf({ rect: { left: 1700, top: 30, width: 200, height: 40 }, screen })).toEqual({
      x: -20,
      y: 30,
      align_x: 'right',
      align_y: 'top'
    });

    expect(placementOf({ rect: { left: 860, top: 900, width: 200, height: 40 }, screen })).toEqual({
      x: 0,
      y: -140,
      align_x: 'center',
      align_y: 'bottom'
    });
  });

  it('round-trips with panelRect', () => {
    const rect = { left: 333, top: 444, width: 120, height: 60 };
    const placement = placementOf({ rect, screen });

    expect(panelRect({ panel: { ...placement, width: 120, height: 60 }, screen })).toEqual(rect);
  });
});

describe('dragRect and clampRect', () => {
  it('snaps to the grid and keeps the panel on screen', () => {
    const rect = { left: 100, top: 100, width: 200, height: 40 };

    expect(dragRect({ rect, dx: 13, dy: -7, screen, grid: 4 })).toMatchObject({ left: 112, top: 92 });
    expect(dragRect({ rect, dx: 5000, dy: -5000, screen, grid: 4 })).toMatchObject({ left: 1720, top: 0 });
    expect(clampRect({ rect: { left: -5, top: 2000, width: 3000, height: 40 }, screen })).toMatchObject({ left: 0, top: 1040 });
  });
});

describe(stageScale, () => {
  it('fits the screen into the stage', () => {
    expect(stageScale({ screen, stage: { width: 640, height: 360 } })).toBeCloseTo(1 / 3);
    expect(stageScale({ screen: { width: 0, height: 0 }, stage: { width: 640, height: 360 } })).toBe(360);
  });
});

describe(dragTo, () => {
  const drag = { id: 'damage_log', mouseX: 100, mouseY: 100, scale: 0.5, rect: { left: 400, top: 400, width: 200, height: 40 } };

  it('moves the panel by the pointer distance in screen pixels', () => {
    expect(dragTo({ drag, pointer: { x: 110, y: 90 }, screen, grid: 4 })).toEqual({
      id: 'damage_log',
      rect: { left: 420, top: 380, width: 200, height: 40 }
    });
  });

  it('refuses a stage that has no size yet', () => {
    expect(dragTo({ drag: { ...drag, scale: 0 }, pointer: { x: 110, y: 90 }, screen, grid: 4 })).toBeNull();
  });
});

describe(moveMessage, () => {
  it('sends the placement of the moved rectangle', () => {
    const rect = { left: 1700, top: 30, width: 200, height: 40 };

    expect(moveMessage({ id: 'damage_log', rect, screen })).toEqual({ type: 'hud_move', panel: 'damage_log', ...placementOf({ rect, screen }) });
  });
});
