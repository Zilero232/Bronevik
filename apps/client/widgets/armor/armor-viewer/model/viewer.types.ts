import type { RefObject } from 'react';

import type { CameraPresetKey } from '../lib/camera-presets';

export type ViewCommand = {
  preset: CameraPresetKey;
  nonce: number;
};

export type OrbitInput = {
  azimuth?: number;
  polar?: number;
  zoom?: number;
};

export type ViewerHandles = {
  capture: () => string;
  orbit: (input: OrbitInput) => void;
};

export type ViewerHandlesRef = RefObject<ViewerHandles | null>;
