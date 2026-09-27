import type { ModelBounds } from '../../../lib/scene-parts';
import type { OrbitControlsRef, ViewCommand, ViewerHandlesRef } from '../../viewer.types';

export type UseCameraBridgeInput = {
  bounds: ModelBounds;
  command: ViewCommand;
  reducedMotion: boolean;
  controlsRef: OrbitControlsRef;
  handles: ViewerHandlesRef;
};
