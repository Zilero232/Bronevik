import type { ArmorGeometry } from '@bronevik/gamedata';

import type { CameraPresetKey } from '../../../lib/camera-presets';
import type { ViewerHandlesRef } from '../../viewer.types';

export type UseArmorCanvasInput = {
  geometry: ArmorGeometry;
  handles: ViewerHandlesRef;
  onPreset: (preset: CameraPresetKey) => void;
};
