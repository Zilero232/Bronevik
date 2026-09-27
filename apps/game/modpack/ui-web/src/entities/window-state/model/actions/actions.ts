import type { UiComponent } from '../../../../shared/api/protocol';
import type { SetSettingInput } from './actions.types';

import { send } from '../../../../shared/api/protocol';

export const setSetting = ({ component, key, value }: SetSettingInput): void => {
  send({ type: 'set', component, key, value });
};

export const toggleSwitch = (component: UiComponent): void => {
  if (component.switch) {
    setSetting({ component: component.id, key: component.switch.key, value: !component.switch.value });
  }
};
