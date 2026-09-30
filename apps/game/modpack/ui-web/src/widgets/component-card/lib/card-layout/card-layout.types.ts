import type { UiComponent, UiField, UiState } from '../../../../shared/api/protocol';

export type CardLayoutInput = {
  component: UiComponent;
  fields: UiField[] | undefined;
  isExpanded: boolean;
  forceOpen: boolean;
};

export type CardLayout = {
  fields: UiField[];
  expandable: boolean;
  open: boolean;
  showEmpty: boolean;
};

export type PanelPreviewInput = {
  component: UiComponent;
  panels: UiState['hud']['panels'];
};
