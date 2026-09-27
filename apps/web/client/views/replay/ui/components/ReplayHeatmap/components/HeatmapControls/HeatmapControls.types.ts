import type { HeatmapModeChoice, HeatmapScope } from '../../../../../model/hooks';

export type HeatmapControlsProps = {
  hasReplayMode: boolean;
  modeChoice: HeatmapModeChoice;
  scope: HeatmapScope;
  onModeChoiceChange: (value: HeatmapModeChoice) => void;
  onScopeChange: (value: HeatmapScope) => void;
};
