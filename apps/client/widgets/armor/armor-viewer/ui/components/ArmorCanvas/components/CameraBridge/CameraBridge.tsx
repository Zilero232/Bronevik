'use client';

import type { CameraBridgeProps } from './CameraBridge.types';

import { useCameraBridge } from '../../../../../model/hooks';

export const CameraBridge = (props: CameraBridgeProps) => {
  'use no memo';

  useCameraBridge(props);

  return null;
};
