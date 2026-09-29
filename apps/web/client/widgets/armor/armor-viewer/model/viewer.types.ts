import type { OrbitControls } from '@react-three/drei';
import type { ComponentRef, RefObject } from 'react';

import type { CameraPresetKey } from '../lib/camera-presets';

export type ViewCommand = {
  preset: CameraPresetKey;
  nonce: number;
};

type OrbitInput = {
  azimuth?: number;
  polar?: number;
  zoom?: number;
};

export type ViewerHandles = {
  capture: () => string;
  orbit: (input: OrbitInput) => void;
};

export type ViewerHandlesRef = RefObject<ViewerHandles | null>;

export type OrbitControlsRef = RefObject<ComponentRef<typeof OrbitControls> | null>;
