'use client';

import { useFullscreen } from '@siberiacancode/reactuse';
import { useRef, useState } from 'react';

import type { CameraPresetKey } from '../../../lib/camera-presets';
import type { ViewCommand, ViewerHandles } from '../../viewer.types';
import type { UseArmorViewerInput } from './use-armor-viewer.types';

import { useViewerActions } from '../use-viewer-actions';

export const useArmorViewer = ({ slug }: UseArmorViewerInput) => {
  const { ref, value: isFullscreen, toggle } = useFullscreen<HTMLDivElement>();
  const [command, setCommand] = useState<ViewCommand>({ preset: 'initial', nonce: 0 });
  const handlesRef = useRef<ViewerHandles>(null);
  const { screenshot, share } = useViewerActions({ slug, handles: handlesRef });

  const onPreset = (preset: CameraPresetKey) => setCommand(({ nonce }) => ({ preset, nonce: nonce + 1 }));

  return { ref, isFullscreen, toggle, command, handlesRef, onPreset, screenshot, share };
};
