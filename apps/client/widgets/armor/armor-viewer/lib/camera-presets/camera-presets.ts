import type { Vec3 } from '@otmetki/gamedata';

import type { OrbitStepInput, PresetPositionInput } from './camera-presets.types';

import { ARMOR_CAMERA, PRESET_DIRECTIONS } from '../../config';

export const presetPosition = ({ preset, center, radius }: PresetPositionInput): Vec3 => {
  const [x, y, z] = PRESET_DIRECTIONS[preset];
  const length = Math.hypot(x, y, z);
  const distance = radius * ARMOR_CAMERA.distanceFactor;

  return [center[0] + (x / length) * distance, center[1] + (y / length) * distance, center[2] + (z / length) * distance];
};

export const orbitStep = ({ position, target, azimuth, polar, zoom, maxRadius }: OrbitStepInput): Vec3 => {
  const offset = [position[0] - target[0], position[1] - target[1], position[2] - target[2]];
  const radius = Math.min(maxRadius, Math.max(ARMOR_CAMERA.minRadius, Math.hypot(...offset) * zoom));
  const theta = Math.atan2(offset[0], offset[2]) + azimuth;
  const phi = Math.min(Math.PI - ARMOR_CAMERA.minPolar, Math.max(ARMOR_CAMERA.minPolar, Math.acos(offset[1] / (Math.hypot(...offset) || 1)) + polar));

  return [
    target[0] + radius * Math.sin(phi) * Math.sin(theta),
    target[1] + radius * Math.cos(phi),
    target[2] + radius * Math.sin(phi) * Math.cos(theta)
  ];
};
