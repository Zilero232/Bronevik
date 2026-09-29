import type { VIEW_PRESETS } from '../../../config';

type ViewPreset = (typeof VIEW_PRESETS)[number];

export type ViewerToolbarProps = {
  isFullscreen: boolean;
  onPreset: (preset: ViewPreset) => void;
  onFullscreen: () => void;
  onScreenshot: () => void;
  onShare: () => void;
};
