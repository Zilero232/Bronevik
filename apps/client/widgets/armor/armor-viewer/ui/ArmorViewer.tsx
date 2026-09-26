'use client';

import { useFullscreen } from '@siberiacancode/reactuse';
import { useRef, useState } from 'react';

import { ArmorInspectPanel, ArmorInspectProvider } from '@/features/armor/armor-inspect';

import type { CameraPresetKey } from '../lib/camera-presets';
import type { ViewCommand, ViewerHandles } from '../model/viewer.types';
import type { ArmorViewerProps } from './ArmorViewer.types';

import { useViewerActions } from '../model/hooks';
import { ArmorStage, ViewerToolbar } from './components';

import s from './ArmorViewer.module.scss';

export const ArmorViewer = ({ model, slug }: ArmorViewerProps) => {
  const { ref, value: isFullscreen, toggle } = useFullscreen<HTMLDivElement>();
  const [command, setCommand] = useState<ViewCommand>({ preset: 'initial', nonce: 0 });
  const handlesRef = useRef<ViewerHandles>(null);
  const { screenshot, share } = useViewerActions({ slug, handles: handlesRef });

  const onPreset = (preset: CameraPresetKey) => setCommand(({ nonce }) => ({ preset, nonce: nonce + 1 }));

  return (
    <ArmorInspectProvider modules={model.response.modules}>
      <div ref={ref} className={s.root} data-fullscreen={isFullscreen}>
        <section className={s.viewport}>
          <ViewerToolbar isFullscreen={isFullscreen} onFullscreen={toggle} onPreset={onPreset} onScreenshot={screenshot} onShare={share} />
          <ArmorStage command={command} geometry={model.geometry} handles={handlesRef} onPreset={onPreset} />
        </section>
        <ArmorInspectPanel />
      </div>
    </ArmorInspectProvider>
  );
};
