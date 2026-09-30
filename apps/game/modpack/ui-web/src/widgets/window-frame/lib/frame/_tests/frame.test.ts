import { describe, expect, it } from 'vitest';

import { WINDOW_FRAME } from '../../../config';
import { centredFrame, clampFrame, fitFrame, layoutOf, moveFrame, resizeFrame, zoomStep } from '../frame';

const FULL_HD = { width: 1920, height: 1080 };
const SMALL = { width: 1280, height: 720 };
const saved = { placed: true, x: 100, y: 60, width: 1000, height: 700, zoom: 100 };

describe(fitFrame, () => {
  it('centres the default size until the player moves the window', () => {
    expect(fitFrame({ saved: { ...saved, placed: false }, screen: FULL_HD })).toEqual({ x: 340, y: 140, width: 1240, height: 800 });
    expect(centredFrame(SMALL)).toEqual({ x: 24, y: 24, width: 1232, height: 672 });
  });

  it('puts a saved window back, pulled on screen after a resolution change', () => {
    expect(fitFrame({ saved, screen: FULL_HD })).toEqual({ x: 100, y: 60, width: 1000, height: 700 });
    expect(fitFrame({ saved: { ...saved, x: 1500, y: 900 }, screen: SMALL })).toEqual({ x: 280, y: 20, width: 1000, height: 700 });
    expect(fitFrame({ saved: { ...saved, width: 0 }, screen: FULL_HD }).width).toBe(WINDOW_FRAME.defaultSize.width);
  });
});

describe(clampFrame, () => {
  it('keeps the minimum size unless the screen itself is smaller', () => {
    expect(clampFrame({ frame: { x: 0, y: 0, width: 100, height: 100 }, screen: FULL_HD })).toEqual({ x: 0, y: 0, width: 760, height: 480 });

    expect(clampFrame({ frame: { x: 0, y: 0, width: 100, height: 100 }, screen: { width: 640, height: 400 } })).toEqual({
      x: 0,
      y: 0,
      width: 640,
      height: 400
    });
  });
});

describe(moveFrame, () => {
  it('drags the window and stops at the screen edges', () => {
    const frame = { x: 100, y: 100, width: 1000, height: 700 };

    expect(moveFrame({ frame, dx: 50, dy: -30, screen: FULL_HD })).toEqual({ x: 150, y: 70, width: 1000, height: 700 });
    expect(moveFrame({ frame, dx: 5000, dy: -5000, screen: FULL_HD })).toEqual({ x: 920, y: 0, width: 1000, height: 700 });
  });
});

describe(resizeFrame, () => {
  it('grows by the edge that is dragged, never past the screen or under the minimum', () => {
    const frame = { x: 100, y: 100, width: 1000, height: 700 };

    expect(resizeFrame({ frame, dx: 40, dy: 30, edge: 'corner', screen: FULL_HD })).toEqual({ x: 100, y: 100, width: 1040, height: 730 });
    expect(resizeFrame({ frame, dx: 40, dy: 30, edge: 'right', screen: FULL_HD })).toEqual({ x: 100, y: 100, width: 1040, height: 700 });
    expect(resizeFrame({ frame, dx: 40, dy: 30, edge: 'bottom', screen: FULL_HD })).toEqual({ x: 100, y: 100, width: 1000, height: 730 });
    expect(resizeFrame({ frame, dx: 5000, dy: 5000, edge: 'corner', screen: FULL_HD })).toEqual({ x: 100, y: 100, width: 1820, height: 980 });
    expect(resizeFrame({ frame, dx: -900, dy: -900, edge: 'corner', screen: FULL_HD })).toEqual({ x: 100, y: 100, width: 760, height: 480 });
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
  });
});
