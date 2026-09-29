import type { ArmorPaneKey } from '../../../lib/camera-sync';

export type PaneSwitchProps = {
  value: ArmorPaneKey;
  primaryName: string;
  secondaryName: string;
  onChange: (pane: ArmorPaneKey) => void;
};
