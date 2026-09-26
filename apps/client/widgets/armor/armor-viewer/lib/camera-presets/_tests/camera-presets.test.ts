import type { Vec3 } from '@bronevik/gamedata';

import { describe, expect, it } from 'vitest';

import { ARMOR_CAMERA, VIEW_PRESETS } from '../../../config';
import { orbitStep, presetPosition } from '../camera-presets';

const center: Vec3 = [0, 1, 0];
const radius = 4;
const distanceTo = (point: Vec3, target: Vec3) => Math.hypot(point[0] - target[0], point[1] - target[1], point[2] - target[2]);

describe('presetPosition', () => {
  it('keeps every preset at the same distance from the model', () => {
    for (const preset of VIEW_PRESETS) {
      expect(distanceTo(presetPosition({ preset, center, radius }), center)).toBeCloseTo(radius * ARMOR_CAMERA.distanceFactor);
    }
  });

  it('looks at the front from +z, the rear from -z and the top from above', () => {
    expect(presetPosition({ preset: 'front', center, radius })[2]).toBeGreaterThan(0);
    expect(presetPosition({ preset: 'rear', center, radius })[2]).toBeLessThan(0);
    expect(presetPosition({ preset: 'top', center, radius })[1]).toBeGreaterThan(center[1] + radius);
  });
});

describe('orbitStep', () => {
  const position: Vec3 = [0, 1, 10];
  const base = { position, target: center, azimuth: 0, polar: 0, zoom: 1, maxRadius: 100 };

  it('rotates around the target without changing the distance', () => {
    const next = orbitStep({ ...base, azimuth: Math.PI / 2 });

    expect(distanceTo(next, center)).toBeCloseTo(10);
    expect(next[0]).toBeCloseTo(10);
  });

  it('zooms towards the target and clamps to the allowed range', () => {
    expect(distanceTo(orbitStep({ ...base, zoom: 0.5 }), center)).toBeCloseTo(5);
    expect(distanceTo(orbitStep({ ...base, zoom: 0.001 }), center)).toBeCloseTo(ARMOR_CAMERA.minRadius);
    expect(distanceTo(orbitStep({ ...base, zoom: 50 }), center)).toBeCloseTo(100);
  });

  it('never flips over the pole', () => {
    const next = orbitStep({ ...base, polar: -10 });

    expect(next[1]).toBeLessThan(center[1] + 10);
    expect(Math.acos((next[1] - center[1]) / distanceTo(next, center))).toBeCloseTo(ARMOR_CAMERA.minPolar);
  });
});
