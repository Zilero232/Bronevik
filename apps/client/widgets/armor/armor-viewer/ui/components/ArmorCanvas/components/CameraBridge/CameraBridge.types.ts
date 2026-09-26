import type { OrbitControls } from '@react-three/drei';
import type { ComponentRef, RefObject } from 'react';

import type { ModelBounds } from '../../../../../lib/scene-parts';
import type { ViewCommand, ViewerHandlesRef } from '../../../../../model/viewer.types';

export type OrbitControlsRef = RefObject<ComponentRef<typeof OrbitControls> | null>;

export type CameraBridgeProps = {
  bounds: ModelBounds;
  command: ViewCommand;
  reducedMotion: boolean;
  controlsRef: OrbitControlsRef;
  handles: ViewerHandlesRef;
};
