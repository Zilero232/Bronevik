'use client';

import { useFullscreen, useMediaQuery } from '@siberiacancode/reactuse';
import { useRef, useState } from 'react';

import type { CameraPresetKey } from '../../../lib/camera-presets';
import type { ArmorPaneKey } from '../../../lib/camera-sync';
import type { ViewCommand, ViewerHandles } from '../../viewer.types';
import type { UseArmorViewerInput } from './use-armor-viewer.types';

import { ARMOR_COMPARE } from '../../../config';
import { createCameraSync } from '../../../lib/camera-sync';
import { useViewerActions } from '../use-viewer-actions';

export const useArmorViewer = ({ slug, hasCompare }: UseArmorViewerInput) => {
  const { ref, value: isFullscreen, toggle } = useFullscreen<HTMLDivElement>();
  const isCompact = useMediaQuery(ARMOR_COMPARE.compactQuery);
  const [command, setCommand] = useState<ViewCommand>({ preset: 'initial', nonce: 0 });
  const [activePane, setActivePane] = useState<ArmorPaneKey>('primary');
  const [sync] = useState(createCameraSync);
  const primaryHandlesRef = useRef<ViewerHandles>(null);
  const secondaryHandlesRef = useRef<ViewerHandles>(null);

  const isToggled = hasCompare && isCompact;
  const leader: ArmorPaneKey = isToggled && activePane === 'secondary' ? 'secondary' : 'primary';
  const handles = leader === 'secondary' ? secondaryHandlesRef : primaryHandlesRef;

  const { screenshot, share } = useViewerActions({ slug, handles });

  const onPreset = (preset: CameraPresetKey) => setCommand(({ nonce }) => ({ preset, nonce: nonce + 1 }));

  return {
    ref,
    isFullscreen,
    toggle,
    command,
    sync,
    leader,
    primaryHandlesRef,
    secondaryHandlesRef,
    isToggled,
    activePane,
    showPrimary: !isToggled || activePane === 'primary',
    showSecondary: hasCompare && (!isToggled || activePane === 'secondary'),
    setActivePane,
    onPreset,
    screenshot,
    share
  };
};
