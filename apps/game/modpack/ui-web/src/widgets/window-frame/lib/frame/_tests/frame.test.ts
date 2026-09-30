import { describe, expect, it } from 'vitest';

import { WINDOW_FRAME } from '../../../config';
import { boundsOf, centredFrame, clampFrame, fitFrame, layoutOf, moveFrame, resizeFrame, zoomStep } from '../frame';

const FULL_HD = { left: 0, top: 0, right: 1920, bottom: 1080 };
const SMALL = { left: 0, top: 0, right: 1280, bottom: 720 };
const saved = { placed: true, x: 100, y: 60, width: 1000, height: 700, zoom: 100 };

describe(boundsOf, () => {
  it('is the whole screen for a view at the screen origin', () => {
    expect(boundsOf({ screen: { width: 1920, height: 1080 }, view: { x: 0, y: 0, width: 1920, height: 1080 } })).toEqual(FULL_HD);
  });

  it('is the part of the screen the view covers, in the view, for a view the client placed off the origin', () => {
    const screen = { width: 1663, height: 962 };

    expect(boundsOf({ screen, view: { x: 211.5, y: 81, width: 1663, height: 962 } })).toEqual({ left: 0, top: 0, right: 1451.5, bottom: 881 });
    expect(boundsOf({ screen, view: { x: -100, y: -50, width: 1663, height: 962 } })).toEqual({ left: 100, top: 50, right: 1663, bottom: 962 });
  });

  it('falls back to the screen while the view has no size yet', () => {
    expect(boundsOf({ screen: { width: 1920, height: 1080 }, view: { x: 700, y: 300, width: 0, height: 0 } })).toEqual({
      left: 0,
      top: 0,
      right: 1220,
      bottom: 780
    });

    expect(boundsOf({ screen: { width: 1920, height: 1080 }, view: { x: 5000, y: 0, width: 0, height: 0 } })).toEqual(FULL_HD);
  });
});

describe(fitFrame, () => {
  it('opens centred at the default size the first time', () => {
    expect(fitFrame({ saved: { ...saved, placed: false, width: 0, height: 0 }, bounds: FULL_HD })).toEqual({
      x: 340,
      y: 140,
      width: 1240,
      height: 800
    });

    expect(centredFrame({ bounds: SMALL })).toEqual({ x: 24, y: 24, width: 1232, height: 672 });
  });

  it('opens centred at the saved size, whatever position was saved', () => {
    expect(fitFrame({ saved, bounds: FULL_HD })).toEqual({ x: 460, y: 190, width: 1000, height: 700 });
    expect(fitFrame({ saved: { ...saved, x: 5000, y: -3000 }, bounds: SMALL })).toEqual({ x: 140, y: 24, width: 1000, height: 672 });
  });

  it('centres in the visible part of a view placed off the screen origin', () => {
    const bounds = boundsOf({ screen: { width: 1663, height: 962 }, view: { x: 211.5, y: 81, width: 1663, height: 962 } });

    expect(fitFrame({ saved: { ...saved, width: 1240, height: 800 }, bounds })).toEqual({ x: 106, y: 41, width: 1240, height: 800 });
  });
});

describe(clampFrame, () => {
  it('keeps the minimum size unless the screen itself is smaller', () => {
    expect(clampFrame({ frame: { x: 0, y: 0, width: 100, height: 100 }, bounds: FULL_HD })).toEqual({ x: 0, y: 0, width: 760, height: 480 });

    expect(clampFrame({ frame: { x: 0, y: 0, width: 100, height: 100 }, bounds: { left: 0, top: 0, right: 640, bottom: 400 } })).toEqual({
      x: 0,
      y: 0,
      width: 640,
      height: 400
    });
  });

  it('never leaves the visible part of the view', () => {
    expect(clampFrame({ frame: { x: 0, y: 0, width: 1000, height: 700 }, bounds: { left: 100, top: 50, right: 1663, bottom: 962 } })).toEqual({
      x: 100,
      y: 50,
      width: 1000,
      height: 700
    });
  });
});

describe(moveFrame, () => {
  it('drags the window and stops at the screen edges', () => {
    const frame = { x: 100, y: 100, width: 1000, height: 700 };

    expect(moveFrame({ frame, dx: 50, dy: -30, bounds: FULL_HD })).toEqual({ x: 150, y: 70, width: 1000, height: 700 });
    expect(moveFrame({ frame, dx: 5000, dy: -5000, bounds: FULL_HD })).toEqual({ x: 920, y: 0, width: 1000, height: 700 });
  });
});

describe(resizeFrame, () => {
  it('grows by the edge that is dragged, never past the screen or under the minimum', () => {
    const frame = { x: 100, y: 100, width: 1000, height: 700 };

    expect(resizeFrame({ frame, dx: 40, dy: 30, edge: 'corner', bounds: FULL_HD })).toEqual({ x: 100, y: 100, width: 1040, height: 730 });
    expect(resizeFrame({ frame, dx: 40, dy: 30, edge: 'right', bounds: FULL_HD })).toEqual({ x: 100, y: 100, width: 1040, height: 700 });
    expect(resizeFrame({ frame, dx: 40, dy: 30, edge: 'bottom', bounds: FULL_HD })).toEqual({ x: 100, y: 100, width: 1000, height: 730 });
    expect(resizeFrame({ frame, dx: 5000, dy: 5000, edge: 'corner', bounds: FULL_HD })).toEqual({ x: 100, y: 100, width: 1820, height: 980 });
    expect(resizeFrame({ frame, dx: -900, dy: -900, edge: 'corner', bounds: FULL_HD })).toEqual({ x: 100, y: 100, width: 760, height: 480 });
  });
});

describe(zoomStep, () => {
  it('walks the zoom steps and snaps an odd value onto them', () => {
    expect(zoomStep({ zoom: 100, direction: 1 })).toBe(110);
    expect(zoomStep({ zoom: 100, direction: -1 })).toBe(90);
    expect(zoomStep({ zoom: 150, direction: 1 })).toBe(150);
    expect(zoomStep({ zoom: 80, direction: -1 })).toBe(80);
    expect(zoomStep({ zoom: 105, direction: 1 })).toBe(110);
    expect(zoomStep({ zoom: 105, direction: -1 })).toBe(100);
  });
});

describe(layoutOf, () => {
  it('reflows by the width the content really gets at the chosen zoom', () => {
    expect(layoutOf({ frame: { x: 0, y: 0, width: 1400, height: 800 }, zoom: 100 })).toMatchObject({ compactNav: false, columns: 2, scale: 1 });
    expect(layoutOf({ frame: { x: 0, y: 0, width: 1400, height: 800 }, zoom: 125 })).toMatchObject({ compactNav: false, columns: 1 });
    expect(layoutOf({ frame: { x: 0, y: 0, width: 900, height: 600 }, zoom: 100 })).toMatchObject({ compactNav: true, columns: 1 });
    expect(layoutOf({ frame: { x: 0, y: 0, width: 1000, height: 600 }, zoom: 80 }).inner).toEqual({ width: 1250, height: 750 });
    expect(WINDOW_FRAME.defaultZoom).toBe(100);
  });
});
