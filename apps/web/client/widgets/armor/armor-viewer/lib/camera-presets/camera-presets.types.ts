import type { Vec3 } from '@otmetki/gamedata';

import type { PRESET_DIRECTIONS } from '../../config';
import type { ModelBounds } from '../scene-parts';

export type CameraPresetKey = keyof typeof PRESET_DIRECTIONS;

export type PresetPositionInput = ModelBounds & {
  preset: CameraPresetKey;
};

export type OrbitStepInput = {
  position: Vec3;
  target: Vec3;
  azimuth: number;
  polar: number;
  zoom: number;
  maxRadius: number;
};
