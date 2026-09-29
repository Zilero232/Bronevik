import type { ArmorGeometry } from '@otmetki/gamedata';

import type { CameraPresetKey } from '../../../lib/camera-presets';
import type { ArmorPaneKey, CameraSync } from '../../../lib/camera-sync';
import type { ViewCommand, ViewerHandlesRef } from '../../../model/viewer.types';

export type ArmorCanvasProps = {
  geometry: ArmorGeometry;
  command: ViewCommand;
  handles: ViewerHandlesRef;
  sync: CameraSync;
  syncId: ArmorPaneKey;
  isLeader: boolean;
  onPreset: (preset: CameraPresetKey) => void;
};
