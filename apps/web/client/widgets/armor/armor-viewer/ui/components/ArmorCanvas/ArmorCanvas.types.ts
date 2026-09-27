import type { ArmorGeometry } from '@otmetki/gamedata';

import type { CameraPresetKey } from '../../../lib/camera-presets';
import type { ViewCommand, ViewerHandlesRef } from '../../../model/viewer.types';

export type ArmorCanvasProps = {
  geometry: ArmorGeometry;
  command: ViewCommand;
  handles: ViewerHandlesRef;
  onPreset: (preset: CameraPresetKey) => void;
};
