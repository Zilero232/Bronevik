'use client';

import { ArmorAttackProvider, ArmorInspectPanel } from '@/features/armor/armor-inspect';

import type { ArmorViewerProps } from './ArmorViewer.types';

import { useArmorViewer } from '../model/hooks';
import { ArmorPane, AttackerPicker, PaneSwitch, ViewerToolbar } from './components';

import s from './ArmorViewer.module.scss';

export const ArmorViewer = ({ model, slug, compare }: ArmorViewerProps) => {
  const {
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
    showPrimary,
    showSecondary,
    setActivePane,
    onPreset,
    screenshot,
    share
  } = useArmorViewer({ slug, hasCompare: Boolean(compare) });

  return (
    <ArmorAttackProvider modules={model.response.modules}>
      <div ref={ref} className={s.root} data-compare={Boolean(compare)} data-fullscreen={isFullscreen}>
        <section className={s.viewport}>
          <ViewerToolbar isFullscreen={isFullscreen} onFullscreen={toggle} onPreset={onPreset} onScreenshot={screenshot} onShare={share} />
          {compare && isToggled && (
            <PaneSwitch primaryName={model.response.vehicle.name} secondaryName={compare.name} value={activePane} onChange={setActivePane} />
          )}
          <div className={s.panes}>
            {showPrimary && (
              <ArmorPane
                command={command}
                handles={primaryHandlesRef}
                leader={leader}
                model={model}
                paneKey='primary'
                showName={Boolean(compare)}
                sync={sync}
                onPreset={onPreset}
              />
            )}
            {compare && showSecondary && (
              <div className={s.secondary}>
                {compare.model ? (
                  <ArmorPane
                    showName
                    command={command}
                    handles={secondaryHandlesRef}
                    leader={leader}
                    model={compare.model}
                    paneKey='secondary'
                    sync={sync}
                    onPreset={onPreset}
                  />
                ) : (
                  compare.fallback
                )}
              </div>
            )}
          </div>
        </section>
        <ArmorInspectPanel attacker={<AttackerPicker />} />
      </div>
    </ArmorAttackProvider>
  );
};
