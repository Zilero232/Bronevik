'use client';

import { ArmorInspectPanel, ArmorInspectProvider } from '@/features/armor/armor-inspect';

import type { ArmorViewerProps } from './ArmorViewer.types';

import { useArmorViewer } from '../model/hooks/use-armor-viewer';
import { ArmorStage, ViewerToolbar } from './components';

import s from './ArmorViewer.module.scss';

export const ArmorViewer = ({ model, slug }: ArmorViewerProps) => {
  const { ref, isFullscreen, toggle, command, handlesRef, onPreset, screenshot, share } = useArmorViewer({ slug });

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
