import type { UiAction, UiComponent, UiField } from '../../../../../shared/api/protocol';

export type RunActionInput = {
  action: UiAction;
  row?: string;
  value?: string;
};

export type UseComponentCardInput = {
  component: UiComponent;
  fields?: UiField[];
  forceOpen?: boolean;
};
